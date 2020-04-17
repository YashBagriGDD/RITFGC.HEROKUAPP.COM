"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("ERROR | Username or Password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("ERROR | All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("ERROR | Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    className: "mainForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST"
  }, /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Sign Up"
  }));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Sign Up"
  }));
}; //#region Home Video Code


var VideoList = function VideoList(props) {
  if (props.videos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "videoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyVideo"
    }, "No Videos Yet"));
  }

  var videoNodes = props.videos.map(function (video) {
    var char1Src;
    var char2Src;
    var gameSrc;
    var img1;
    var img2;

    if (video.game === "BBCF") {
      char1Src = "/assets/img/CF/".concat(video.char1, ".png");
      char2Src = "/assets/img/CF/".concat(video.char2, ".png");
      gameSrc = "/assets/img/CF/".concat(video.game, ".png");
    } else if (video.game === "GBVS") {
      char1Src = "/assets/img/GBVS/".concat(video.char1, ".png");
      char2Src = "/assets/img/GBVS/".concat(video.char2, ".png");
      gameSrc = "/assets/img/GBVS/".concat(video.game, ".png");
    } else {
      char1Src = "/assets/img/UNICLR/".concat(video.char1, ".png");
      char2Src = "/assets/img/UNICLR/".concat(video.char2, ".png");
      gameSrc = "/assets/img/UNICLR/".concat(video.game, ".png");
    }

    img1 = /*#__PURE__*/React.createElement("img", {
      id: "char1Img",
      src: char1Src,
      alt: video.char1
    });
    img2 = /*#__PURE__*/React.createElement("img", {
      id: "char2Img",
      src: char2Src,
      alt: video.char2
    });

    if (video.game === "UNICLR") {
      img2 = /*#__PURE__*/React.createElement("img", {
        id: "char2Img",
        className: "flip",
        src: char2Src,
        alt: video.char2
      });
    }

    return /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      scope: "row"
    }, /*#__PURE__*/React.createElement("img", {
      id: "gameLogo",
      className: "gameLogo",
      src: gameSrc,
      alt: video.gameSrc
    })), /*#__PURE__*/React.createElement("td", null, video.player1), /*#__PURE__*/React.createElement("td", null, img1), /*#__PURE__*/React.createElement("td", null, "vs"), /*#__PURE__*/React.createElement("td", null, img2), /*#__PURE__*/React.createElement("td", null, video.player2), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: video.link,
      className: "icons-sm yt-ic",
      target: "_blank"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fab fa-youtube fa-2x"
    }, " ")))));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "pageContainer"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-sm"
  }, videoNodes), /*#__PURE__*/React.createElement("div", {
    id: "ad"
  }, "Your Ad Here!"), /*#__PURE__*/React.createElement("div", {
    id: "adtwo"
  }, "Your Ad Here!"));
};

var loadAllVideosFromServer = function loadAllVideosFromServer() {
  sendAjax('GET', '/getAllVideos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  }); //ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
}; //#endregion


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content")); //ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content")); // ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  var homeButton = document.querySelector("#home");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadAllVideosFromServer();
    return false;
  });
  loadAllVideosFromServer(); //Default window
  //Default loads all Videos on the server 
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// https://stackoverflow.com/questions/32704027/how-to-call-bootstrap-alert-with-jquery
var handleError = function handleError(message) {
  console.log('Called');
  $(".alert").text(message);
  $(".alert").show();
  $(".alert").addClass('in');
  $(".alert").delay(2000).fadeOut('slow');
  return false;
};

var redirect = function redirect(response) {
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
