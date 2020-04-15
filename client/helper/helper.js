
// https://stackoverflow.com/questions/7676356/can-twitter-bootstrap-alerts-fade-in-as-well-as-out
const handleError = (message) => {
    console.log('Called');
    $(".alert").text(message);
    $(".alert").show();
    $(".alert").delay(2000).fadeOut('slow');
    return false;

};


const redirect = (response) => {
    $("#domoMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

