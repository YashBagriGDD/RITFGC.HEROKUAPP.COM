"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//At the top of the file
var _csrf; // Values to help not repeat methods


var pageList = false;
var loopNumber = 1;
var videoKey = 0;

var handleVideo = function handleVideo(e) {
  videoKey = 0;
  var modValue = 0;
  var charVideoKey = 0;
  var charModValue = 0;
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

  if ($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' || $("#videoLink").val() == '') {
    handleError("ERROR | All fields are required");
    return false;
  }

  if ($('#videoForm').find('#Game').find(":selected").text() === 'Game' || $('#videoForm').find('#Game').find(":selected").text() === '') {
    handleError("ERROR | Please select a game");
    return false;
  } // Check if the error uses the correct link *just copying the url


  if (!$("#videoLink").val().includes('www.youtube.com')) {
    handleError("ERROR | Please use a valid link");
    return false;
  } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers
  // https://www.w3schools.com/jsref/jsref_replace.asp


  var regex = /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g; /// Putting each input into its own object to send to the server 
  ///

  $('#videoForm').find('td > input').each(function () {
    if (modValue === 0) {
      // Using regex to ensure the timestamp is correct
      if (regex.test(this.value)) {
        var array = this.value.match(regex);
        JSON.stringify(array);
        var newArray = array[0].replace(/:.*?/, "h");
        var newArray2 = newArray.replace(/:.*?/, "m");
        var finalArray = newArray2 + "s";
        videoObj[videoKey].link = "".concat(videoObj.videoLink, "&t=").concat(finalArray);
      } else {
        videoObj[videoKey].link = "".concat(videoObj.videoLink, "&t=").concat(this.value);
      }
    }

    if (modValue === 1) {
      videoObj[videoKey].player1 = this.value;
    }

    if (modValue === 2) {
      // Once the end is reached, add the game from the selection
      // Add characters as well
      // and iterate the videoKey and reset the modification values
      videoObj[videoKey].player2 = this.value;
      videoObj[videoKey].game = $('#videoForm').find('#Game').find(":selected").text();
      videoKey++;
      modValue = -1;
    }

    modValue++;
  }); // Set the new video key to the loop number for the next loop

  videoKey = loopNumber; // For character selection

  $('#videoForm').find('select').each(function () {
    // One of the selections is for the game, we don't need that
    // Also, if the key is equal to zero, skip it.
    if (this.id !== 'Game' && videoKey > 0) {
      if (charModValue % 2 !== 0) {
        // In order to ensure the object exists, take it from 
        // the loop number and go down what's already been created
        // and add that property to the list
        videoObj[loopNumber - videoKey].char1 = this.value;
      } else if (charModValue % 2 === 0) {
        videoObj[loopNumber - videoKey].char2 = this.value;
        videoKey--;
      }
    }

    charModValue++;
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

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("ERROR | All fields are required");
    return false;
  }

  if ($("#pass").val() === $("#pass2").val()) {
    handleError("ERROR | Passwords cannot match");
    return false;
  }

  if ($("#pass2").val() !== $("#pass3").val()) {
    handleError("ERROR | The new passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
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

  if ($("#char1Search").find(":selected").text() !== 'Character 1' && $("#char1Search").find(":selected").text() !== 'Anyone') {
    queryString += "&char1=".concat($("#char1Search").find(":selected").text());
  }

  if ($("#char2Search").find(":selected").text() !== 'Character 2' && $("#char2Search").find(":selected").text() !== 'Anyone') {
    queryString += "&char2=".concat($("#char2Search").find(":selected").text());
  }

  if ($("#gameSearch").val()) {
    queryString += "&game=".concat($("#gameSearch").val());
  }

  console.log($('#searchForm').find('#char1Search').find(":selected").text());
  console.log(queryString);
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
}; /// FORM TO SUBMIT NEW DATA


var VideoForm = function VideoForm(props) {
  var _React$createElement;

  // Rows to dynamically add more matches
  // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
  var rows = [];
  var charSelection;
  var char2Selection;
  console.log($('#videoForm').find('#Game').find(":selected").text());

  if ($('#videoForm').find('#Game').find(":selected").text() === 'BBCF' || $('#videoForm').find('#Game').find(":selected").text() === 'Game' || $('#videoForm').find('#Game').find(":selected").text() === '') {
    charSelection = bbcfChar1Select;
    char2Selection = bbcfChar2Select;
  } else if ($('#videoForm').find('#Game').find(":selected").text() === 'GBVS') {
    charSelection = gbvsChar1Select;
    char2Selection = gbvsChar2Select;
  } else if ($('#videoForm').find('#Game').find(":selected").text() === 'UNICLR') {
    charSelection = uniChar1Select;
    char2Selection = uniChar2Select;
  }

  for (var i = 0; i < loopNumber; i++) {
    rows.push( /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "timestamp",
      type: "text",
      name: "timestamp",
      placeholder: "Timestamp"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "playerOne",
      type: "text",
      name: "playerOne",
      placeholder: "Player 1"
    })), /*#__PURE__*/React.createElement("td", null, charSelection), /*#__PURE__*/React.createElement("td", null, "vs"), /*#__PURE__*/React.createElement("td", null, char2Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "playerTwo",
      type: "text",
      name: "playerTwo",
      placeholder: "Player 2"
    })))));
  }

  return /*#__PURE__*/React.createElement("form", {
    id: "videoForm",
    onSubmit: handleVideo,
    name: "videoForm",
    action: "/main",
    method: "POST",
    className: "videoForm"
  }, /*#__PURE__*/React.createElement("div", {
    id: "static"
  }, /*#__PURE__*/React.createElement("input", {
    id: "videoLink",
    className: "form-control",
    type: "text",
    name: "videoLink",
    placeholder: "YouTube Link (https://www.youtube.com/watch?v=***********)"
  }), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "Game",
    placeholder: "Game"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    selected: true,
    hidden: true
  }, "Game"), /*#__PURE__*/React.createElement("option", {
    value: "bbcf"
  }, "BBCF"), /*#__PURE__*/React.createElement("option", {
    value: "gbvs"
  }, "GBVS"), /*#__PURE__*/React.createElement("option", {
    value: "uniclr"
  }, "UNICLR")), /*#__PURE__*/React.createElement("table", {
    id: "videoFormTable",
    className: "table table-sm table-dark"
  }, rows), /*#__PURE__*/React.createElement("input", (_React$createElement = {
    className: "makeVideoSubmit"
  }, _defineProperty(_React$createElement, "className", "btn btn-primary"), _defineProperty(_React$createElement, "type", "submit"), _defineProperty(_React$createElement, "value", "Add Video"), _React$createElement)), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("button", {
    id: "addMatchButton",
    className: "btn btn-default",
    type: "button"
  }, "Add a Match")), /*#__PURE__*/React.createElement("div", {
    id: "adSpace"
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
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass3",
    type: "password",
    name: "pass3",
    placeholder: "re-type password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Change"
  }));
}; /// RENDERING THE LIST
/// Render the list depending on if it's a page list or the full list


var VideoList = function VideoList(props) {
  // Do we need to show deletion or not
  var deleteButton;
  var adSpace;
  console.log(props.videos.length);

  if (props.videos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "videoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyVideo"
    }, "No videos found!"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      id: "ad"
    }, "Your Ad Here!"), /*#__PURE__*/React.createElement("div", {
      id: "adtwo"
    }, "Your Ad Here!")));
  }

  var videoNodes = props.videos.map(function (video) {
    // https://react-cn.github.io/react/tips/if-else-in-JSX.html
    if (pageList) {
      deleteButton = /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
        className: "delete btn",
        value: video._id,
        onClick: handleDelete
      }, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      })));
      adSpace = null;
    } else {
      deleteButton = null;
      adSpace = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        id: "ad"
      }, "Your Ad Here!"), /*#__PURE__*/React.createElement("div", {
        id: "adtwo"
      }, "Your Ad Here!"));
    }

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
    }, " "))), deleteButton));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "pageContainer"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-sm table-dark"
  }, videoNodes), adSpace);
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
  }), document.querySelector("#content")); // Unmount the search bar

  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
};

var createAddWindow = function createAddWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search")); // If theh game changes, re-render

  $('#videoForm').find('#Game').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
      csrf: csrf
    }), document.querySelector("#content"));
  }); // Get the button that was made in the videoForm

  var addMatchButton = document.querySelector("#addMatchButton");
  addMatchButton.addEventListener("click", function (e) {
    loopNumber++; //If it's clicked, just re-render

    ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
      csrf: csrf
    }), document.querySelector("#content"));
  });
};

var createSearchForm = function createSearchForm() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search")); // If theh game changes, re-render

  $('#searchForm').find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search"));
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
    createSearchForm();
    loadAllVideosFromServer();
    return false;
  });
  pageButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSearchForm();
    loadVideosFromServer();
    return false;
  });
  createSearchForm();
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
}); //#region Character Forms

var bbcfChar1 = /*#__PURE__*/React.createElement("select", {
  id: "char1Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
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
  id: "char2Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 2"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
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
  id: "char1Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
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
  id: "char2Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 2"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
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
  id: "char1Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
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
  id: "char2Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 2"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
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
var bbcfChar1Select = /*#__PURE__*/React.createElement("select", {
  id: "char1"
}, /*#__PURE__*/React.createElement("option", {
  value: "Amane",
  selected: true
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
var bbcfChar2Select = /*#__PURE__*/React.createElement("select", {
  id: "char2"
}, /*#__PURE__*/React.createElement("option", {
  value: "Amane",
  selected: true
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
var gbvsChar1Select = /*#__PURE__*/React.createElement("select", {
  id: "char1"
}, /*#__PURE__*/React.createElement("option", {
  value: "Beezlebub",
  selected: true
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
var gbvsChar2Select = /*#__PURE__*/React.createElement("select", {
  id: "char2"
}, /*#__PURE__*/React.createElement("option", {
  value: "Beezlebub",
  selected: true
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
var uniChar1Select = /*#__PURE__*/React.createElement("select", {
  id: "char1"
}, /*#__PURE__*/React.createElement("option", {
  value: "Akatsuki",
  selected: true
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
var uniChar2Select = /*#__PURE__*/React.createElement("select", {
  id: "char2"
}, /*#__PURE__*/React.createElement("option", {
  value: "Akatsuki",
  selected: true
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
