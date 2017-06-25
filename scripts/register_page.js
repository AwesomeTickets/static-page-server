$(document).ready(function() {
  const global_api = {
    check_phone_num_state: `${global_url}/resource/user/`,
    get_sms: `${global_url}/resource/sms/`,
    register: `${global_url}/resource/user/`,
    login: `${global_url}/resource/session/`,
    drop: `${global_url}/resource/session/drop`,
  }

  const container = document.getElementById('reg_container');

  (function(){
    init();
  })();

  function init() {
    set_inputs_focus();
    set_btn();
  }

  function set_inputs_focus() {
    var input = document.getElementById('reg_phone_input_in'),
      hint = document.getElementById('reg_phone_input_hint'),
      btn = document.getElementById('reg_confirm_btn');

    set_input_focus(input, hint);

    input.oninput = function() {
      if(this.value.length == 11) {
        btn.className = 'clickable';
        btn.disabled=false;
      } else {
        btn.className = 'non-clickable';
        btn.disabled=true;
      }
    }
  }

  function set_input_focus(input, hint) {
    input.onfocus = function() {
      hint.className='focus-hint';
      this.className='focus';
    }

    input.onblur = function () {
      hint.className='non-focus-hint';
      this.className='non-focus';
    }
  }

  function set_btn() {
    document.getElementById('reg_confirm_btn').onclick=function() {
      var phone = document.getElementById('reg_phone_input_in').value;
      if (check_phone_num_valid(phone)) {
        check_phone_state(phone);
      } else {
        document.getElementById('input_err_hint').innerText = '请输入有效的手机号';
      }
    };
  }

  function check_phone_num_valid(phone) {
    var re = /(13|14|15|18)[0-9]{8}/;
    return re.test(phone);
  }

  function check_phone_state(phone) {
    $.get(global_api.check_phone_num_state+phone, function(data) {
      var flag = data.register;
      //var flag = true;   // for developing
      if (flag) {
        go_to_sign_in(phone);   // change the page
      } else {
        go_to_register(phone);    // change the page
        ask_sms(phone);
        document.getElementById('input_err_hint').innerText = "";
      }
    });
  }

  function ask_sms(num) {
    $.get(global_api.get_sms + num, function(data) {

    }).error(function(err) {
      // console.log("get sms fail");
    });
  }

// go to register
  function go_to_register(num) {
    // 添加密码输入的组
    var pw_group = document.createElement("div");
    pw_group.id='pw_group';

    // 密码输入的提示
    var pw_hint = document.createElement("div");
    pw_hint.id = 'pw_hint';
    pw_hint.innerText = '设置密码';
    pw_hint.className='non-focus-hint';
    pw_group.appendChild(pw_hint);

    // 密码输入框
    var pw_input = document.createElement("input");
    pw_input.id = 'pw_input';
    pw_input.className = 'non-focus';
    pw_input.type = 'password';
    pw_group.appendChild(pw_input);
    set_input_focus(pw_input, pw_hint);

    // 短信输入提示
    var sms_hint = document.createElement("div");
    sms_hint.innerText = '验证码';
    sms_hint.className = 'non-focus-hint';
    sms_hint.id = 'sms_hint';

    // 短信输入的组
    var sms_group = document.createElement("div");
    sms_group.id = 'sms_group';

    // 短信输入框
    var sms_input = document.createElement("input");
    sms_input.id = 'sms_input';
    sms_input.className = 'non-focus';
    set_input_focus(sms_input, sms_hint);
    sms_group.appendChild(sms_input);

    // 重发短信按钮
    var resent_btn = document.createElement("button");
    resent_btn.id = 'resent_btn';
    resent_btn.className = 'non-clickable';
    resent_btn.innerText = "60S 后重发";
    resent_btn.disabled = true;
    sms_group.appendChild(resent_btn);
    counting_time(60, resent_btn);   // 倒计时函数

    // 错误信息提示
    var err_div = document.getElementById('input_err_hint'),
      confirm_btn = document.getElementById('reg_confirm_btn');

    // 添加上述组件 构成注册页面
    container.insertBefore(pw_group,err_div);
    container.insertBefore(sms_hint,err_div);
    container.insertBefore(sms_group,err_div);

    // 设置确认按钮状态 设置两个按钮的动作
    confirm_btn.className = 'non-clickable';
    set_btns_action(confirm_btn, resent_btn);

    // 增加输入框的监听
    set_input_listener(sms_input, pw_input);
  }

  function counting_time(value, btn) {
    var val = value;
    if (btn == null)return;
    if (val == 0) {
      btn.disabled = false;
      btn.innerText = "重发";
      btn.className = "clickable";
      return;
    } else {
      val--;
      btn.innerHTML = val + "s 内重发";
    }
    setTimeout(function() {
      counting_time(val, btn);
    }, 1000);
  }

  function set_btns_action(confirm_btn, resent_btn) {
    confirm_btn.innerText = '注册';
    confirm_btn.onclick = function() {
      // 确认验证码函数
      register_req(document.getElementById('reg_phone_input_in').value,
          document.getElementById('sms_input').value, document.getElementById("pw_input").value
        );
    }

    resent_btn.onclick = function() {
      // 请求重发验证码
      ask_sms(document.getElementById('reg_phone_input_in').value);
      this.disabled = true;
      counting_time(60, this);
    }
  }

  function set_input_listener(sms_input, pw_input) {
    sms_input.oninput = function (){
      var btn = document.getElementById('reg_confirm_btn');
      if (sms_input.value.length == 6 && pw_input.value.length >= 8) {
        btn.className = 'clickable';
        btn.disabled = false;
      } else {
        btn.className = 'non-clickable';
        btn.disabled = true;
      }
    }

    pw_input.oninput = function () {
      var btn = document.getElementById('reg_confirm_btn');
      if (pw_input.value.length >= 8 && sms_input.value.length == 6) {
        btn.className = 'clickable';
        btn.disabled = false;
      } else {
        btn.className = 'non-clickable';
        btn.disabled = true;
      }
    }
  }



// sent the register request
  function register_req(phone, sms, pw) {
    // console.log(pw);
    $.post(global_api.register, {phoneNum:phone, password:pw, smsCode:sms}, function(result) {
      registered();
    }).error(function(err) {
      if (err.responseText.split(',')[0].split(':')[1] == 400) {
        document.getElementById('input_err_hint').innerText = "请设置8位以上数字和字母组合!";
      } else if (err.responseText.split(',')[0].split(':')[1] == 403) {
        document.getElementById('input_err_hint').innerText = "该号码已经注册，请直接登陆";
      } else if (err.responseText.split(',')[0].split(':')[1] == 102) {
        document.getElementById('input_err_hint').innerText = "验证码错误，请核实后重新输入";
      }
    });
  }

  // 注册成功后续动作
  function registered() {
    window.location = '../index.html';
  }
// go to register end

// go to sign in
  function go_to_sign_in(phone) {
    var pw_group = document.createElement("div");
    pw_group.id = 'pw_group';

    var pw_hint = document.createElement("div");
    pw_hint.innerText = '密码';
    pw_hint.id = 'pw_hint';
    pw_hint.className = 'non-focus-hint';
    pw_group.appendChild(pw_hint);

    var pw_input = document.createElement("input");
    pw_input.id = 'pw_input';
    pw_input.className = 'non-focus';
    pw_input.type = 'password';
    pw_input.oninput = function() {
      var btn = document.getElementById('reg_confirm_btn');
      if (pw_input.value.length >= 8) {
        btn.disabled = false;
        btn.className = 'clickable';
      } else {
        btn.disabled = true;
        btn.className = 'non-clickable';
      }
    }
    pw_group.appendChild(pw_input);

    container.insertBefore(pw_group, document.getElementById('input_err_hint'));

    set_sign_in_btn();
    set_input_focus(pw_input, pw_hint);
  }

  function set_sign_in_btn() {
    var btn = document.getElementById('reg_confirm_btn');
    btn.disabled = true;
    btn.className = 'non-clickable';

    // sign in action
    btn.onclick = function() {
      login(document.getElementById('reg_phone_input_in').value, document.getElementById('pw_input').value);
    }
  }

  function login(phone, pw) {
    $.ajax({
      url: global_api.login,
      type: "POST",
      data: {
        phoneNum:phone,
        password:pw,
      },
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        window.location = '../index.html';
      },
    });
  }


});
