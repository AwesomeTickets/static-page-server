validator = { //这是一个什么变量:一个对象 类似于json 里面装内容 然后暴露一个接口
  form: {
    username: {
      status: false,
      errorMessage: '用户名为6~18位英文字母、数字或下划线，必须以英文字母开头'
    }, 
    password: {
      status: false,
      errorMessage: '密码为~18位英文字母、数字或下划线，必须以英文字母开头'
    },
    name: {
      status: false,
      errorMessage: '姓名不能为空'
    },
    sex: {
      status: false,
      errorMessage: '性别不能为空'
    },
    phone: {
      status: false,
      errorMessage: '电话号码不能为空'
    },
    address: {
      status: false,
      errorMessage: '地址不能为空'
    }
  }, 

  isUsernameValid: function (username) {
    return this.form.username.status = /^[a-zA-Z][a-zA-Z0-9_]{6,18}$/.test(username);
  },

  isPasswordValid: function (password) {
    return this.form.password.status = /^[a-zA-Z][a-zA-Z0-9_]{6,18}$/.test(password);
  },

  isNameValid: function (name) {
    return this.form.name.status = name != ""; 
  },

  isSexValid: function (sex) {
    return this.form.sex.status = sex != ""; 
  },

  isPhoneValid: function (phone) {
    return this.form.phone.status = phone != ""; 
  },

  isAddressValid: function (address) {
    return this.form.address.status = address != ""; 
  }
  // isFormValid: function(){
  //   return this.form.username.status && this.form.sid.status && this.form.phone.status && this.form.email.status;
  // }, //检查整个表单是否合法

}

// if (typeof module == 'object') { // 服务端共享
//   module.exports = validator
// }

