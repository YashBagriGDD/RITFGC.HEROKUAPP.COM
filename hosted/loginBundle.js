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
}; // Handle the search


var handleSearch = function handleSearch(e) {
  e.preventDefault();
  var queryString = "".concat($('#searchForm').attr('action'), "?"); // Check each search field to see if anything is in them. If there is data in them, add it to the querystring

  if ($("#player1Search").val()) {
    queryString += "player1=".concat($("#player1Search").val());
  }

  if ($("#player2Search").val()) {
    queryString += "&player2=".concat($("#player2Search").val());
  }

  if ($("#char1").find(":selected").text() !== 'Character 1') {
    queryString += "&char1=".concat($("#char1").find(":selected").text());
  }

  if ($("#char2").find(":selected").text() !== 'Character 2') {
    queryString += "&char2=".concat($("#char2").find(":selected").text());
  }

  if ($("#gameSearch").val()) {
    queryString += "&game=".concat($("#gameSearch").val());
  }

  sendAjax('GET', queryString, null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  });
}; // Search form


var SearchForm = function SearchForm() {
  var charSelection;
  var char2Selection;

  if ($('#searchForm').find('#gameSearch').find(":selected").text() === 'BBCF') {
    charSelection = bbcfChar1;
    char2Selection = bbcfChar2;
  } else if ($('#searchForm').find('#gameSearch').find(":selected").text() === 'GBVS') {
    charSelection = gbvsChar1;
    char2Selection = gbvsChar2;
  } else if ($('#searchForm').find('#gameSearch').find(":selected").text() === 'UNICLR') {
    charSelection = uniChar1;
    char2Selection = uniChar2;
  }

  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    onChange: handleSearch,
    name: "searchForm",
    action: "/search",
    method: "GET",
    className: "searchForm"
  }, /*#__PURE__*/React.createElement("table", {
    id: "searchFormTable",
    className: "table table-sm"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "player1Search",
    type: "text",
    name: "player1",
    placeholder: "Player 1"
  })), /*#__PURE__*/React.createElement("td", null, charSelection), /*#__PURE__*/React.createElement("td", null, "vs"), /*#__PURE__*/React.createElement("td", null, char2Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "player2Search",
    type: "text",
    name: "player2",
    placeholder: "Player 2"
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("select", {
    id: "gameSearch",
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    selected: true,
    hidden: true
  }, "Game"), /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "All"), /*#__PURE__*/React.createElement("option", {
    value: "bbcf"
  }, "BBCF"), /*#__PURE__*/React.createElement("option", {
    value: "gbvs"
  }, "GBVS"), /*#__PURE__*/React.createElement("option", {
    value: "uniclr"
  }, "UNICLR"))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "searchFormSubmit btn",
    id: "formSubmit",
    type: "submit",
    value: "Search"
  }))))));
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
    value: "Sign In"
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
    }, "No videos found!"));
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
  }), document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search")); //ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search")); // ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
};

var createSearchForm = function createSearchForm() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search")); // If theh game changes, re-render

  $('#searchForm').find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search"));
  });
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
    createSearchForm();
    loadAllVideosFromServer();
    return false;
  });
  createSearchForm();
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
}); //#region Character Forms

var bbcfChar1 = /*#__PURE__*/React.createElement("select", {
  id: "char1",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Amane"
}, "Amane"), /*#__PURE__*/React.createElement("option", {
  value: "Arakune"
}, "Arakune"), /*#__PURE__*/React.createElement("option", {
  value: "Azrael"
}, "Azrael"), /*#__PURE__*/React.createElement("option", {
  value: "Bang"
}, "Bang"), /*#__PURE__*/React.createElement("option", {
  value: "Bullet"
}, "Bullet"), /*#__PURE__*/React.createElement("option", {
  value: "Carl"
}, "Carl"), /*#__PURE__*/React.createElement("option", {
  value: "Celica"
}, "Celica"), /*#__PURE__*/React.createElement("option", {
  value: "Es"
}, "Es"), /*#__PURE__*/React.createElement("option", {
  value: "Hakumen"
}, "Hakumen"), /*#__PURE__*/React.createElement("option", {
  value: "Hazama"
}, "Hazama"), /*#__PURE__*/React.createElement("option", {
  value: "Hibiki"
}, "Hibiki"), /*#__PURE__*/React.createElement("option", {
  value: "Izanami"
}, "Izanami"), /*#__PURE__*/React.createElement("option", {
  value: "Izayoi"
}, "Izayoi"), /*#__PURE__*/React.createElement("option", {
  value: "Jin"
}, "Jin"), /*#__PURE__*/React.createElement("option", {
  value: "Jubei"
}, "Jubei"), /*#__PURE__*/React.createElement("option", {
  value: "Kagura"
}, "Kagura"), /*#__PURE__*/React.createElement("option", {
  value: "Kokonoe"
}, "Kokonoe"), /*#__PURE__*/React.createElement("option", {
  value: "Litchi"
}, "Litchi"), /*#__PURE__*/React.createElement("option", {
  value: "Makoto"
}, "Makoto"), /*#__PURE__*/React.createElement("option", {
  value: "Mai"
}, "Mai"), /*#__PURE__*/React.createElement("option", {
  value: "Naoto"
}, "Naoto"), /*#__PURE__*/React.createElement("option", {
  value: "Nine"
}, "Nine"), /*#__PURE__*/React.createElement("option", {
  value: "Noel"
}, "Noel"), /*#__PURE__*/React.createElement("option", {
  value: "Platinum"
}, "Platinum"), /*#__PURE__*/React.createElement("option", {
  value: "Rachel"
}, "Rachel"), /*#__PURE__*/React.createElement("option", {
  value: "Ragna"
}, "Ragna"), /*#__PURE__*/React.createElement("option", {
  value: "Relius"
}, "Relius"), /*#__PURE__*/React.createElement("option", {
  value: "Susanoo"
}, "Susanoo"), /*#__PURE__*/React.createElement("option", {
  value: "Tager"
}, "Tager"), /*#__PURE__*/React.createElement("option", {
  value: "Taokaka"
}, "Taokaka"), /*#__PURE__*/React.createElement("option", {
  value: "Tsubaki"
}, "Tsubaki"), /*#__PURE__*/React.createElement("option", {
  value: "Terumi"
}, "Terumi"), /*#__PURE__*/React.createElement("option", {
  value: "Valkenhayn"
}, "Valkenhayn"), /*#__PURE__*/React.createElement("option", {
  value: "Lambda-11"
}, "Lambda-11"), /*#__PURE__*/React.createElement("option", {
  value: "Mu-12"
}, "Mu-12"), /*#__PURE__*/React.createElement("option", {
  value: "Nu-13"
}, "Nu-13"));
var bbcfChar2 = /*#__PURE__*/React.createElement("select", {
  id: "char2",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 2"), /*#__PURE__*/React.createElement("option", {
  value: "Amane"
}, "Amane"), /*#__PURE__*/React.createElement("option", {
  value: "Arakune"
}, "Arakune"), /*#__PURE__*/React.createElement("option", {
  value: "Azrael"
}, "Azrael"), /*#__PURE__*/React.createElement("option", {
  value: "Bang"
}, "Bang"), /*#__PURE__*/React.createElement("option", {
  value: "Bullet"
}, "Bullet"), /*#__PURE__*/React.createElement("option", {
  value: "Carl"
}, "Carl"), /*#__PURE__*/React.createElement("option", {
  value: "Celica"
}, "Celica"), /*#__PURE__*/React.createElement("option", {
  value: "Es"
}, "Es"), /*#__PURE__*/React.createElement("option", {
  value: "Hakumen"
}, "Hakumen"), /*#__PURE__*/React.createElement("option", {
  value: "Hazama"
}, "Hazama"), /*#__PURE__*/React.createElement("option", {
  value: "Hibiki"
}, "Hibiki"), /*#__PURE__*/React.createElement("option", {
  value: "Izanami"
}, "Izanami"), /*#__PURE__*/React.createElement("option", {
  value: "Izayoi"
}, "Izayoi"), /*#__PURE__*/React.createElement("option", {
  value: "Jin"
}, "Jin"), /*#__PURE__*/React.createElement("option", {
  value: "Jubei"
}, "Jubei"), /*#__PURE__*/React.createElement("option", {
  value: "Kagura"
}, "Kagura"), /*#__PURE__*/React.createElement("option", {
  value: "Kokonoe"
}, "Kokonoe"), /*#__PURE__*/React.createElement("option", {
  value: "Litchi"
}, "Litchi"), /*#__PURE__*/React.createElement("option", {
  value: "Makoto"
}, "Makoto"), /*#__PURE__*/React.createElement("option", {
  value: "Mai"
}, "Mai"), /*#__PURE__*/React.createElement("option", {
  value: "Naoto"
}, "Naoto"), /*#__PURE__*/React.createElement("option", {
  value: "Nine"
}, "Nine"), /*#__PURE__*/React.createElement("option", {
  value: "Noel"
}, "Noel"), /*#__PURE__*/React.createElement("option", {
  value: "Platinum"
}, "Platinum"), /*#__PURE__*/React.createElement("option", {
  value: "Rachel"
}, "Rachel"), /*#__PURE__*/React.createElement("option", {
  value: "Ragna"
}, "Ragna"), /*#__PURE__*/React.createElement("option", {
  value: "Relius"
}, "Relius"), /*#__PURE__*/React.createElement("option", {
  value: "Susanoo"
}, "Susanoo"), /*#__PURE__*/React.createElement("option", {
  value: "Tager"
}, "Tager"), /*#__PURE__*/React.createElement("option", {
  value: "Taokaka"
}, "Taokaka"), /*#__PURE__*/React.createElement("option", {
  value: "Tsubaki"
}, "Tsubaki"), /*#__PURE__*/React.createElement("option", {
  value: "Terumi"
}, "Terumi"), /*#__PURE__*/React.createElement("option", {
  value: "Valkenhayn"
}, "Valkenhayn"), /*#__PURE__*/React.createElement("option", {
  value: "Lambda-11"
}, "Lambda-11"), /*#__PURE__*/React.createElement("option", {
  value: "Mu-12"
}, "Mu-12"), /*#__PURE__*/React.createElement("option", {
  value: "Nu-13"
}, "Nu-13"));
var gbvsChar1 = /*#__PURE__*/React.createElement("select", {
  id: "char1",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Beezlebub"
}, "Beezlebub"), /*#__PURE__*/React.createElement("option", {
  value: "Charlotta"
}, "Charlotta"), /*#__PURE__*/React.createElement("option", {
  value: "Djeeta"
}, "Djeeta"), /*#__PURE__*/React.createElement("option", {
  value: "Ferry"
}, "Ferry"), /*#__PURE__*/React.createElement("option", {
  value: "Gran"
}, "Gran"), /*#__PURE__*/React.createElement("option", {
  value: "Katalina"
}, "Katalina"), /*#__PURE__*/React.createElement("option", {
  value: "Ladiva"
}, "Ladiva"), /*#__PURE__*/React.createElement("option", {
  value: "Lancelot"
}, "Lancelot"), /*#__PURE__*/React.createElement("option", {
  value: "Lowain"
}, "Lowain"), /*#__PURE__*/React.createElement("option", {
  value: "Metera"
}, "Metera"), /*#__PURE__*/React.createElement("option", {
  value: "Narmaya"
}, "Narmaya"), /*#__PURE__*/React.createElement("option", {
  value: "Percival"
}, "Percival"), /*#__PURE__*/React.createElement("option", {
  value: "Soriz"
}, "Soriz"), /*#__PURE__*/React.createElement("option", {
  value: "Vaseraga"
}, "Vaseraga"), /*#__PURE__*/React.createElement("option", {
  value: "Zeta"
}, "Zeta"));
var gbvsChar2 = /*#__PURE__*/React.createElement("select", {
  id: "char2",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Beezlebub"
}, "Beezlebub"), /*#__PURE__*/React.createElement("option", {
  value: "Charlotta"
}, "Charlotta"), /*#__PURE__*/React.createElement("option", {
  value: "Djeeta"
}, "Djeeta"), /*#__PURE__*/React.createElement("option", {
  value: "Ferry"
}, "Ferry"), /*#__PURE__*/React.createElement("option", {
  value: "Gran"
}, "Gran"), /*#__PURE__*/React.createElement("option", {
  value: "Katalina"
}, "Katalina"), /*#__PURE__*/React.createElement("option", {
  value: "Ladiva"
}, "Ladiva"), /*#__PURE__*/React.createElement("option", {
  value: "Lancelot"
}, "Lancelot"), /*#__PURE__*/React.createElement("option", {
  value: "Lowain"
}, "Lowain"), /*#__PURE__*/React.createElement("option", {
  value: "Metera"
}, "Metera"), /*#__PURE__*/React.createElement("option", {
  value: "Narmaya"
}, "Narmaya"), /*#__PURE__*/React.createElement("option", {
  value: "Percival"
}, "Percival"), /*#__PURE__*/React.createElement("option", {
  value: "Soriz"
}, "Soriz"), /*#__PURE__*/React.createElement("option", {
  value: "Vaseraga"
}, "Vaseraga"), /*#__PURE__*/React.createElement("option", {
  value: "Zeta"
}, "Zeta"));
var uniChar1 = /*#__PURE__*/React.createElement("select", {
  id: "char1",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Akatsuki"
}, "Akatsuki"), /*#__PURE__*/React.createElement("option", {
  value: "Byakuya"
}, "Byakuya"), /*#__PURE__*/React.createElement("option", {
  value: "Carmine"
}, "Carmine"), /*#__PURE__*/React.createElement("option", {
  value: "Chaos"
}, "Chaos"), /*#__PURE__*/React.createElement("option", {
  value: "Eltnum"
}, "Eltnum"), /*#__PURE__*/React.createElement("option", {
  value: "Enkidu"
}, "Enkidu"), /*#__PURE__*/React.createElement("option", {
  value: "Gordeau"
}, "Gordeau"), /*#__PURE__*/React.createElement("option", {
  value: "Hilda"
}, "Hilda"), /*#__PURE__*/React.createElement("option", {
  value: "Hyde"
}, "Hyde"), /*#__PURE__*/React.createElement("option", {
  value: "Linne"
}, "Linne"), /*#__PURE__*/React.createElement("option", {
  value: "Londrekia"
}, "Londrekia"), /*#__PURE__*/React.createElement("option", {
  value: "Merkava"
}, "Merkava"), /*#__PURE__*/React.createElement("option", {
  value: "Phonon"
}, "Phonon"), /*#__PURE__*/React.createElement("option", {
  value: "Seth"
}, "Seth"), /*#__PURE__*/React.createElement("option", {
  value: "Vatista"
}, "Vatista"), /*#__PURE__*/React.createElement("option", {
  value: "Wagner"
}, "Wagner"), /*#__PURE__*/React.createElement("option", {
  value: "Waldstein"
}, "Waldstein"), /*#__PURE__*/React.createElement("option", {
  value: "Yuzuriha"
}, "Yuzuriha"));
var uniChar2 = /*#__PURE__*/React.createElement("select", {
  id: "char2",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Akatsuki"
}, "Akatsuki"), /*#__PURE__*/React.createElement("option", {
  value: "Byakuya"
}, "Byakuya"), /*#__PURE__*/React.createElement("option", {
  value: "Carmine"
}, "Carmine"), /*#__PURE__*/React.createElement("option", {
  value: "Chaos"
}, "Chaos"), /*#__PURE__*/React.createElement("option", {
  value: "Eltnum"
}, "Eltnum"), /*#__PURE__*/React.createElement("option", {
  value: "Enkidu"
}, "Enkidu"), /*#__PURE__*/React.createElement("option", {
  value: "Gordeau"
}, "Gordeau"), /*#__PURE__*/React.createElement("option", {
  value: "Hilda"
}, "Hilda"), /*#__PURE__*/React.createElement("option", {
  value: "Hyde"
}, "Hyde"), /*#__PURE__*/React.createElement("option", {
  value: "Linne"
}, "Linne"), /*#__PURE__*/React.createElement("option", {
  value: "Londrekia"
}, "Londrekia"), /*#__PURE__*/React.createElement("option", {
  value: "Merkava"
}, "Merkava"), /*#__PURE__*/React.createElement("option", {
  value: "Phonon"
}, "Phonon"), /*#__PURE__*/React.createElement("option", {
  value: "Seth"
}, "Seth"), /*#__PURE__*/React.createElement("option", {
  value: "Vatista"
}, "Vatista"), /*#__PURE__*/React.createElement("option", {
  value: "Wagner"
}, "Wagner"), /*#__PURE__*/React.createElement("option", {
  value: "Waldstein"
}, "Waldstein"), /*#__PURE__*/React.createElement("option", {
  value: "Yuzuriha"
}, "Yuzuriha")); //#endregion
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
