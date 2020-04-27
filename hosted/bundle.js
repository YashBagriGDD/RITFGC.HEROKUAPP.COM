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
