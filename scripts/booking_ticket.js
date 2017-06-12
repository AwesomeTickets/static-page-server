import "babel-polyfill";
$(document).ready(function () {
  const global_api = {
    movie_info: `${global_url}/resource/movie/`,
    cinema: `${global_url}/resource/cinema/`,
    cinema_hall: `${global_url}/resource/cinema-hall/`,
    sms: `${global_url}/resource/sms/`,
    ticket: `${global_url}/resource/ticket`,
    checkLogin: `${global_url}/resource/session/check`
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

  function checkLogin() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: global_api.checkLogin,
        type: "GET",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          resolve(data);
        },
      });
    });
  }

  async function phone_check_init() {
    phone_check_container.innerHTML = "";

    var phone_container = document.createElement("div");
    phone_container.id = 'phone_container';

    var phone_hint = document.createElement("div");
    phone_hint.id = 'phone_hint';
    phone_hint.innerText = "订票手机号";
    phone_container.appendChild(phone_hint);

    let loginData = await checkLogin();

    var phone_num = document.createElement("div");
    phone_num.id = 'phone_num';
    phone_num.innerText = loginData.phoneNum;  // get from cookie here
    phone_container.appendChild(phone_num);

    phone_check_container.appendChild(phone_container);

    var phone_check_btn = document.createElement("button");
    phone_check_btn.id = "phone_check_btn";
    phone_check_btn.className = "click_btn";
    phone_check_btn.innerText = "获取电子票";
    phone_check_container.appendChild(phone_check_btn);

    add_phone_check_input_and_btn_action();
  }

  function add_phone_check_input_and_btn_action() {
    const btn = document.getElementById("phone_check_btn"),
      input = document.getElementById("phone_num");

    btn.onclick = function() {
      if (check_input_valid(turn_to_num(input.innerText))) {
        sent_booking_info(input.innerText.split(' ').join(''));
      } else {
        document.getElementById("input_hint").innerText = "请输入有效手机号";
      }
    }
  }

  function check_input_valid(input) {
    var re = /(13|14|15|18)[0-9]{8}/;
    return re.test(input);
  }

  function turn_to_num(input) {
    var re = /[0-9]/;
    var res = "";
    for (var i = 0; i < input.length; i++) {
      if (re.test(input[i])) {
        res+=input[i];
      }
    }
    return res;
  }

  function sent_booking_info(phoneNum) {
    var seat_post = "";
    for (var i = 0 ; i < seats.length; i++) {
      for (var j = 0 ; j < seats[i].length; j++) {
        seat_post += (i == 0 && j == 0 ? '' : ',') + seats[i][j];
      }
    }

    $.ajax({
      url: global_api.ticket,
      type: "POST",
      data: {
        movieOnShowId: movieOnShowId,
        phoneNum: phoneNum,
        seats: seat_post
      },
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        show_the_ticket_key(data.ticketCode);
      },
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
