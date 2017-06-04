import "babel-polyfill";

$(document).ready(function() {
  const global_api = {
    login: `${global_url}/resource/session`,
  }

  const login_button = document.getElementById('login_button'),
    login_phone = $('.form-group')[0].childNodes[1],
    login_password = $('.form-group')[1].childNodes[1];


  login_button.onclick = function(event) {
    console.log('event: ', login_phone.value, ' ', login_password.value);
    event.preventDefault();
  }
});
