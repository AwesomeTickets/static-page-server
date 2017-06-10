import "babel-polyfill";

$(document).ready(function() {
  const global_api = {
    login: `${global_url}/resource/session/`,
  }

  const login_button = document.getElementById('login_button'),
    login_error = document.getElementById('login_error'),
    login_phone = $('.form-group')[0].childNodes[1],
    login_password = $('.form-group')[1].childNodes[1];

  function sign_in(phone, password) {
    login_error.innerHTML = '';
    return new Promise((resolve, reject) => {
      $.ajax({
        url: global_api.login,
        type: 'POST',
        data: {
          phoneNum: phone,
          password: password,
        },
        xhrFields: {
          withCredentials: true
        },
        error: function(xhr, status, error) {
          login_error.innerHTML = '手机号或密码错误。'
        },
        success: function(data) {
          window.location = `./account.html?phone=${data.phoneNum}`
        },
      });
    });
  }

  login_button.onclick = async function(event) {
    event.preventDefault();
    let login_action = await sign_in(login_phone.value, login_password.value);
    console.log('login_action: ', login_action);
  }

  login_phone.onfocus = function() {
    login_error.innerHTML = '';
  }

  login_password.onfocus = function() {
    login_error.innerHTML = '';
  }

  // 注册
  const sign_up_button = document.getElementById('sign_up');
  sign_up_button.onclick = function() {
    window.location = './register_page.html';
  }
});
