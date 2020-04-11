"use strict";

//At the top of the file
var _csrf; // Values to help not repeat methods


var pageList = false;
var loopNumber = 1;
var videoKey = 0;
var modValue = 0;

var handleVideo = function handleVideo(e) {
  e.preventDefault();
  videoKey = 0;
  modValue = 0;
  var videoObj = {};
  console.dir(loopNumber);

  for (var i = 0; i < loopNumber; i++) {
    var newObject = {};
    videoObj[i] = newObject;
  }

  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#videoName").val() == '' || $("#videoAge").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  } // Comment this out if you need to send data


  $('#videoForm').find('section > input').each(function () {
    //console.log(this.value);
    //console.log(modValue);
    if (modValue % 2 === 0 || modValue === 0) {
      videoObj[videoKey].name = this.value;
      modValue++;
    } else {
      videoObj[videoKey].age = this.value;
      modValue++;
      videoKey++;
    }
  });
  $('#videoForm').find('input').each(function () {
    if (this.type === 'hidden') {
      videoObj._csrf = this.value;
    }
  });
  console.log(videoObj); // Uncomment this to send data

  sendAjax('POST', $("#videoForm").attr("action"), videoObj, function () {
    loadVideosFromServer();
  });
  return false;
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  var data = {
    uid: e.target.value,
    _csrf: _csrf
  };
  sendAjax('POST', '/delete', data, function () {
    loadVideosFromServer();
  });
  return false;
}; // Handling password change


var handleChange = function handleChange(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  }

  if ($("#pass").val() === $("#pass2").val()) {
    handleError("RAWR! Passwords cannot match!");
    return false;
  }

  sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
  return false;
}; /// FORM TO SUBMIT NEW DATA


var VideoForm = function VideoForm(props) {
  // Rows to dynamically add more matches
  // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
  var rows = [];

  for (var i = 0; i < loopNumber; i++) {
    rows.push( /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "videoName",
      type: "text",
      name: "name",
      placeholder: "Video Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "videoAge",
      type: "text",
      name: "age",
      placeholder: "Video Age"
    })));
  }

  return /*#__PURE__*/React.createElement("form", {
    id: "videoForm",
    onSubmit: handleVideo,
    name: "videoForm",
    action: "/maker",
    method: "POST",
    className: "videoForm"
  }, rows, /*#__PURE__*/React.createElement("input", {
    className: "makeVideoSubmit",
    type: "submit",
    value: "Make Video"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("button", {
    id: "addMatchButton",
    type: "button"
  }, "Add Match"));
}; /// CHANGE PASSWORD WINDOW


var ChangeWindow = function ChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changeForm",
    name: "changeForm",
    onSubmit: handleChange,
    action: "/passChange",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
}; /// RENDERING THE LIST
/// Render the list depending on if it's a page list or the full list


var VideoList = function VideoList(props) {
  // Do we need to show deletion or not
  var deleteButton;

  if (props.videos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "videoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyVideo"
    }, "No Videos Yet"));
  }

  var videoNodes = props.videos.map(function (video) {
    // https://react-cn.github.io/react/tips/if-else-in-JSX.html
    if (pageList) {
      deleteButton = /*#__PURE__*/React.createElement("button", {
        value: video._id,
        onClick: handleDelete
      }, "Delete Item");
    } else {
      deleteButton = null;
    }

    return /*#__PURE__*/React.createElement("div", {
      key: video._id,
      className: "video"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "videoName"
    }, "Name: ", video.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "videoAge"
    }, "Age: ", video.age), deleteButton);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "videoList"
  }, videoNodes);
};

var loadVideosFromServer = function loadVideosFromServer() {
  loopNumber = 1;
  pageList = true;
  sendAjax('GET', '/getVideos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  });
}; // Display all videos for home page


var loadAllVideosFromServer = function loadAllVideosFromServer() {
  loopNumber = 1;
  pageList = false;
  sendAjax('GET', '/getAllVideos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  });
};

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  loopNumber = 1;
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createAddWindow = function createAddWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
    csrf: csrf
  }), document.querySelector("#content")); // Get the button that was made in the videoForm

  var addMatchButton = document.querySelector("#addMatchButton");
  addMatchButton.addEventListener("click", function (e) {
    loopNumber++; //If it's clicked, just re-render

    ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
      csrf: csrf
    }), document.querySelector("#content"));
  });
};

var setup = function setup(csrf) {
  var homeButton = document.querySelector("#home");
  var pageButton = document.querySelector("#myPage");
  var addButton = document.querySelector("#addVideo");
  var passChangeButton = document.querySelector("#passChangeButton");
  passChangeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassChangeWindow(csrf);
    return false;
  });
  addButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAddWindow(csrf);
    return false;
  });
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadAllVideosFromServer();
    return false;
  });
  pageButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadVideosFromServer();
    return false;
  });
  loadAllVideosFromServer();
}; //And set it in getToken


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    _csrf = result.csrfToken;
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
