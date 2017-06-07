import "babel-polyfill";

$(document).ready(function() {
  const global_api = {
    login: `${global_url}/resource/session`,
    sign_up: `${global_url}/resource/user`,
  }

  const login_button = document.getElementById('login_button'),
    login_error = document.getElementById('login_error'),
    login_phone = $('.form-group')[0].childNodes[1],
    login_password = $('.form-group')[1].childNodes[1];

  function sign_up() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: global_api.sign_up,
        type: 'POST',
        data: {
          phoneNum: '13511112222',
          password: 'q123456',
          smsCode: '448291',
        },
        error: function(xhr, status, error) {
          console.log('xhr: ', xhr);
          console.log('status: ', status);
          console.log('error: ', error);
        },
        success: function(data) {
          console.log('data: ', data);
        },
      });
    })
  }

  function post_form(phone, password) {
    login_error.innerHTML = '';
    return new Promise((resolve, reject) => {
      $.ajax({
        url: global_api.login,
        type: 'POST',
        data: {
          phoneNum: '13512345678',
          password: '123456',
        },
        error: function(xhr, status, error) {
          console.log('xhr: ', xhr);
          console.log('status: ', status);
          console.log('error: ', error);
          login_error.innerHTML = '手机号或密码错误。'
        },
        success: function(data) {
          console.log('data: ', data);
        },
      });
    })
  }

  login_button.onclick = async function(event) {
    // console.log('login_phone.value', login_phone.value);
    // console.log('login_password.value', login_password.value);
    event.preventDefault();
    // let sign_up_data = await sign_up();
    // console.log('sign_up_data: ', sign_up_data);
    let login_action = await post_form(login_phone.value, login_password.value);
    login_action.catch(function(err) {
      console.log('erroroooo: ', err);
    })
  }

  login_phone.onfocus = function() {
    login_error.innerHTML = '';
  }

  login_password.onfocus = function() {
    login_error.innerHTML = '';
  }
});
