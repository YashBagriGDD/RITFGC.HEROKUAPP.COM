"use strict";

//At the top of the file
var _csrf; // Values to help not repeat methods


var pageList = false;
var loopNumber = 1;

var handleVideo = function handleVideo(e) {
  var videoKey = 0;
  var modValue = 0;
  e.preventDefault(); // Create a video object to send to the server

  var videoObj = {}; // For each match a user wants to add, push the object

  for (var i = 0; i < loopNumber; i++) {
    var newObject = {};
    videoObj[i] = newObject;
  } // Find the overall link the user inputted


  $('#videoForm').find('input').each(function () {
    if (this.name === 'videoLink') {
      videoObj.videoLink = this.value;
    }
  });
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' || $("#characterOne").val() == '' || $("#characterTwo").val() == '' || $("#videoLink").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  } // Comment this out if you need to send data
  ///
  /// Putting each input into its own object to send to the server 
  ///


  $('#videoForm').find('section > input').each(function () {
    if (modValue === 0) {
      // Each match will have a specific timestamp, so put that here with concatenation
      videoObj[videoKey].link = "".concat(videoObj.videoLink, "&t=").concat(this.value);
    }

    if (modValue === 1) {
      videoObj[videoKey].player1 = this.value;
    }

    if (modValue === 2) {
      videoObj[videoKey].char1 = this.value;
    }

    if (modValue === 3) {
      videoObj[videoKey].char2 = this.value;
    }

    if (modValue === 4) {
      // Once the end is reached, add the game from the selection
      // and iterate the videoKey and reset the modification value
      videoObj[videoKey].player2 = this.value;
      videoObj[videoKey].game = $('#videoForm').find('select').find(":selected").text();
      videoKey++;
      modValue = -1;
    }

    modValue++;
  }); // CSRF is associated with a user, so add a token to the overall object to send to the server

  $('#videoForm').find('input').each(function () {
    if (this.type === 'hidden') {
      videoObj._csrf = this.value;
    }
  });
  console.log(videoObj); // Uncomment this to send data
  // Send the object! :diaYay:

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
      htmlFor: "timestamp"
    }, "timestamp: "), /*#__PURE__*/React.createElement("input", {
      id: "timestamp",
      type: "text",
      name: "timestamp",
      placeholder: "00h00m00s"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "playerOne"
    }, "Player 1: "), /*#__PURE__*/React.createElement("input", {
      id: "playerOne",
      type: "text",
      name: "playerOne",
      placeholder: "Player 1"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "characterOne"
    }, "Character 1: "), /*#__PURE__*/React.createElement("input", {
      id: "characterOne",
      type: "text",
      name: "characterOne",
      placeholder: "Character 1"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "characterTwo"
    }, "Character 2: "), /*#__PURE__*/React.createElement("input", {
      id: "characterTwo",
      type: "text",
      name: "characterTwo",
      placeholder: "Character 2"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "playerTwo"
    }, "Player 2: "), /*#__PURE__*/React.createElement("input", {
      id: "playerTwo",
      type: "text",
      name: "playerTwo",
      placeholder: "Player 2"
    })));
  }

  return /*#__PURE__*/React.createElement("form", {
    id: "videoForm",
    onSubmit: handleVideo,
    name: "videoForm",
    action: "/maker",
    method: "POST",
    className: "videoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "videoLink"
  }, "Video Link: "), /*#__PURE__*/React.createElement("input", {
    id: "videoLink",
    type: "text",
    name: "videoLink",
    placeholder: "Video Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "game"
  }, "Game: "), /*#__PURE__*/React.createElement("select", {
    id: "Game"
  }, /*#__PURE__*/React.createElement("option", {
    value: "gbvs"
  }, "GBVS"), /*#__PURE__*/React.createElement("option", {
    value: "bbcf"
  }, "BBCF")), rows, /*#__PURE__*/React.createElement("input", {
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
      className: "videoLink"
    }, /*#__PURE__*/React.createElement("a", {
      href: video.link
    }, "Link")), /*#__PURE__*/React.createElement("h3", {
      className: "videoPlayerOne"
    }, "Player One: ", video.player1), /*#__PURE__*/React.createElement("h3", {
      className: "videoCharacterOne"
    }, "Character One: ", video.char1), /*#__PURE__*/React.createElement("h3", {
      className: "videoCharacterTwo"
    }, "Character Two: ", video.char2), /*#__PURE__*/React.createElement("h3", {
      className: "videoPlayerTwo"
    }, "Player Two: ", video.player2), deleteButton);
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
