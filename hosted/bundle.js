"use strict";

//At the top of the file
var _csrf;

var pageList = false;

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required!");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer();
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
    loadDomosFromServer();
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


var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    type: "text",
    name: "name",
    placeholder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    type: "text",
    name: "age",
    placeholder: "Domo Age"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
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


var DomoList = function DomoList(props) {
  // Do we need to show deletion or not?
  var deleteButton;

  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos Yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    // https://react-cn.github.io/react/tips/if-else-in-JSX.html
    if (pageList) {
      deleteButton = /*#__PURE__*/React.createElement("button", {
        value: domo._id,
        onClick: handleDelete
      }, "Delete Item");
    } else {
      deleteButton = null;
    }

    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, "Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, "Age: ", domo.age), deleteButton);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer() {
  pageList = true;
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#content"));
  });
}; // Display all domos for home page


var loadAllDomosFromServer = function loadAllDomosFromServer() {
  pageList = false;
  sendAjax('GET', '/getAllDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos
    }), document.querySelector("#content"));
  });
};

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createAddWindow = function createAddWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#content"));
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
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: []
  }), document.querySelector("#content"));
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadAllDomosFromServer();
    return false;
  });
  pageButton.addEventListener("click", function (e) {
    e.preventDefault();
    loadDomosFromServer();
    return false;
  });
  loadDomosFromServer();
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
