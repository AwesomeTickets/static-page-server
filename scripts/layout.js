/*点击LOGO回到主页开始*/
let head_bar_img = document.getElementById('head_bar_img');
if (head_bar_img !== null) {
  head_bar_img.onclick = function() {
    window.location = '../index.html';
  }
}
/*点击LOGO回到主页结束*/

/*点击账户按钮跳转到取票页面 暂时*/
let head_bar_count = document.getElementById('head_bar_count');
if (head_bar_count !== null) {
  head_bar_count.onclick = function() {
    window.location = './get_ticket.html';
  }
}
/*点击账户按钮跳转到取票页面 暂时*/

/*点击首页账户按钮跳转到取票页面 暂时*/
let head_user = document.getElementById('head_user');
if (head_user !== null) {
  head_user.onclick = function() {
    window.location = './layouts/get_ticket.html';
  }
}
/*点击首页账户按钮跳转到取票页面 暂时*/

// 登录
let head_login = document.getElementById('head_login');
if (head_login !== null) {
  head_login.onclick = function() {
    window.location = './layouts/register_login.html';
  }
}
