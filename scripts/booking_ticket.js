$(document).ready(function () {
  const global_url = 'http://120.25.76.106';

  const global_api = {
    movie_info: `${global_url}/resource/movie/`,
    cinema: `${global_url}/resource/cinema/`,
    cinema_hall: `${global_url}/resource/cinema-hall/`,
    sms: `${global_url}/resource/sms/`,
    ticket: `${global_url}/resource/ticket/`,
  }

  const cinemaHallId = location.href.split('?')[1].split('&')[0].split('=')[1],
    movieOnShowId = location.href.split('?')[1].split('&')[1].split('=')[1],
    movieId = location.href.split('?')[1].split('&')[2].split('=')[1],
    showDate = location.href.split('?')[1].split('&')[3].split('=')[1],
    showTime = location.href.split('?')[1].split('&')[4].split('=')[1];
  var seats = location.href.split('?')[1].split('&')[5].split('-');
  for(var i = 0; i < seats.length; i++) {
    seats[i] = seats[i].split('_');
  }

  const movie_info_poster_img = document.getElementById("movie_info_poster_img"),
    movie_info_date = document.getElementById("movie_info_date"),
    movie_info_show_time = document.getElementById("movie_info_show_time"),
    movie_info_cinema = document.getElementById("movie_info_cinema"),
    movie_info_cinema_hall = document.getElementById("movie_info_cinema_hall"),
    movie_info_seats = document.getElementById("movie_info_seats"),
    phone_check_container = document.getElementById("phone_check_container");

  /* init */
  (function() {
    set_poster_img_src();
    set_movie_info_text();
  })();

  /* 电影订购信息部分 */
  // 设置poster图片
  function set_poster_img_src() {
    $.get(global_api.movie_info + movieId, function (data, textStatus) {
      movie_info_poster_img.src = data.posterSmall;
    });
  }

  // 设置电影订票信息
  function set_movie_info_text() {
    $.get(global_api.cinema_hall + cinemaHallId, function (data, textStatus) {
      movie_info_cinema_hall.innerText = data.hallName;
      $.get(global_api.cinema + data.cinemaId, function (data, textStatus) {
        movie_info_cinema.innerText = data.cinemaName;
      });
    });
    movie_info_date.innerText = parseInt(showDate.split('-')[1]) + ' 月 ' + parseInt(showDate.split('-')[2]) + ' 日 ';
    movie_info_show_time.innerText = showTime.split(':')[0] + " : " + showTime.split(':')[1];
    movie_info_seats.innerText = "";
    for (var i = 0; i < seats.length; i++) {
      movie_info_seats.innerText += "  "+ seats[i][0] + "排" + seats[i][1] + "座";
    }
  }
  /* 电影订购信息部分结束 */

  /* 手机验证部分 */
  (function (){
    phone_check_init();
  })();

  function phone_check_init() {
    phone_check_container.innerHTML = "";

    var input_container = document.createElement("div");
    input_container.id = "input_group";

    var input_group_hint = document.createElement("div");
    input_group_hint.id = "input_group_hint";
    input_group_hint.innerText = "+86 | "
    input_container.appendChild(input_group_hint);

    var phone_check_input = document.createElement("input");
    phone_check_input.id = 'phone_check_input';
    input_container.appendChild(phone_check_input);

    phone_check_container.appendChild(input_container);

    var phone_check_btn = document.createElement("button");
    phone_check_btn.id = "phone_check_btn";
    phone_check_btn.className = "nonclick_btn";
    phone_check_btn.innerText = "获取电子票";
    phone_check_btn.disabled = true;
    phone_check_container.appendChild(phone_check_btn);

    add_phone_check_input_and_btn_action();
  }

  function add_phone_check_input_and_btn_action() {
    const btn = document.getElementById("phone_check_btn"),
      input = document.getElementById("phone_check_input");
    input.oninput = function () {
      if (this.value.length == 13) {
        btn.disabled = false;
        btn.className = "click_btn";
      } else {
        btn.disabled = true;
        btn.className = "nonclick_btn";
      }
      if (this.value.length == 3) this.value += "\ ";
      else if (this.value.length == 8) this.value += "\ ";
    }

    btn.onclick = function() {
      if (check_input_valid(trans_phonenum(input.value))) {
        ask_sms(trans_phonenum(input.value));
      } else {
        document.getElementById("input_hint").innerText = "请输入有效手机号";
      }
    }
  }

  function trans_phonenum(str) {
    var num = "";
    var re = /[0-9]/;
    for (var i = 0; i < str.length; i++) {
      if (re.test(str[i])) num += str[i];
    }
    return num;
  }

  function ask_sms(phone_num) {
    $.get(global_api.sms + phone_num, function(data, textStatus){
      get_sms(phone_num);
    }).error(function() {
        document.getElementById("input_hint").innerText = "请输入有效手机号";
      });
  }

  function check_input_valid(input) {
    var re = /(13|14|15|18)[0-9]{8}/;
    return re.test(input);
  }

  function get_sms(phone_num) {
    document.getElementById("input_hint").innerText = "！验证码已发至手机，请输入验证码";
    phone_check_container.removeChild(document.getElementById("phone_check_btn"));
    document.getElementById("phone_check_input").disabled = true;

    var sms_input = document.createElement("input");
    sms_input.id = 'phone_check_sms_input';
    phone_check_container.appendChild(sms_input);

    var sms_btn_resent = document.createElement("button");
    sms_btn_resent.id = 'phone_check_sms_btn_resent';
    sms_btn_resent.innerText = "60s 内重发";
    sms_btn_resent.disabled = true;
    sms_btn_resent.className = "nonclick_btn";
    sms_btn_resent.onclick = function () {
      ask_sms(phone_num);
    }
    phone_check_container.appendChild(sms_btn_resent);
    counting_time(2);

    var sms_btn_confirm = document.createElement("button");
    sms_btn_confirm.id = 'phone_check_sms_btn';
    sms_btn_confirm.innerText = "获取电子票";
    sms_btn_confirm.className = "nonclick_btn";
    sms_btn_confirm.disabled = true;
    phone_check_container.appendChild(sms_btn_confirm);

    set_btn_action(phone_num);
  }

  function counting_time(value) {
    var val = value;
    var btn = document.getElementById("phone_check_sms_btn_resent");
    if (btn == null)return;
    if (val == 0) {
      btn.disabled = false;
      btn.innerText = "重发";
      btn.className = "click_btn";
      return;
    } else {
      val--;
      btn.innerHTML = val + "s 内重发";
    }
    setTimeout(function() {
      counting_time(val);
    }, 1000);
  }

  function set_btn_action(phone_num) {
    var btn = document.getElementById('phone_check_sms_btn'),
      input = document.getElementById("phone_check_sms_input");
    input.oninput = function() {
      if (this.value.length == 6) {
        btn.disabled = false;
        btn.className = "click_btn";
      } else {
        btn.disabled = true;
        btn.className = "nonclick_btn";
      }
    }
    btn.onclick = function() {
      $.post(global_api.sms + phone_num + "/check/", {code:input.value}, function(result,textStatus) {
        console.log(textStatus);
        if (parseInt(result.phoneNum) == parseInt(phone_num)) {
          sent_booking_info(result.phoneNum);
        }
      }).error(function (xhr,errorText,errorType) {
        document.getElementById("input_hint").innerText = "！验证码错误";
      });

    }
  }

  function sent_booking_info(phoneNum) {
    var seat_post = "";
    for (var i = 0 ; i < seats.length; i++) {
      for (var j = 0 ; j < seats[i].length; j++) {
        seat_post += (i == 0 && j == 0 ? '' : ',') + seats[i][j];
      }
    }
    $.post(global_api.ticket, {movieOnShowId:movieOnShowId, phoneNum:phoneNum, seats: seat_post}, function(result) {
      show_the_ticket_key(result.ticketCode);
    });
  }

  function show_the_ticket_key(keyValue) {
    phone_check_container.innerHTML = "";
    document.getElementById("booking_hint").childNodes[0].src = "/static/pictures/assets/getTicket_img_success.png";
    document.getElementById('input_hint').innerHTML = "";

    var hint = document.createElement('div');
    hint.id = 'ticket_key_hint';
    hint.innerText = "取票码";
    phone_check_container.appendChild(hint);

    var key = document.createElement('div');
    key.id = 'ticket_key';
    key.innerText = keyValue;
    phone_check_container.appendChild(key);
  }

});