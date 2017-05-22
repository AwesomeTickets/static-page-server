$(document).ready(function() {
  const global_url = 'http://120.25.76.106';

  const global_api = {
    movie_info: `${global_url}/resource/movie/`,
    get_ticket: `${global_url}/resource/ticket/check/`,
    check_ticket: `${global_url}/resource/ticket/info/`,
    get_movie_info: `${global_url}/resource/movie-on-show/`,
    get_movie_detail: `${global_url}/resource/movie/`,
    get_hall_info: `${global_url}/resource/cinema-hall/`,
    get_cinema_info: `${global_url}/resource/cinema/`,
  }

    
  const phone_container = document.getElementById("phone_container"),
    item_phone = document.getElementById("item_phone"),
    code_input = document.getElementById("code_input"),
    item_code = document.getElementById("item_code"),
    phone_input = document.getElementById("phone_input"),
    
    get_ticket_btn = document.getElementById("get_ticket"),
    check_ticket_btn = document.getElementById("check_ticket"),
    get_ticket_confirm = document.getElementById("get_ticket_confirm"),
    
    cancel_btn = document.getElementById("cancel_get"),
    confirm_btn = document.getElementById("confirm_get"),

    input_container = document.getElementById("input_container"),
    final_container = document.getElementById("final_container"),

    final_movie = document.getElementById("final_movie"),
    final_hall_cinema = document.getElementById("final_hall_cinema"),
    final_hall_room = document.getElementById("final_hall_room"),
    final_date = document.getElementById("final_date"),
    final_time = document.getElementById("final_time"),
    final_seat = document.getElementById("final_seat");

  phone_container.onmouseover = function () {
    phone_container.style.border = "1px solid #E84A3A"
    item_phone.style.color = "#E84A3A";
  }
  phone_container.onmouseout = function () {
    phone_container.style.border = "1px solid #ECE7E7"
    item_phone.style.color = "#999999";
  }

  code_input.onmouseover = function () {
    code_input.style.border = "1px solid #E84A3A"
    item_code.style.color = "#E84A3A";
  }
  code_input.onmouseout = function () {
    code_input.style.border = "1px solid #ECE7E7"
    item_code.style.color = "#999999";
  }

  phone_input.onkeyup = function(e) {
    if(this.value.length == 3 && e.keyCode != 8) {  // 8 退格键键码
      this.value = this.value + ' ';
    } else if( this.value.length == 8 && e.keyCode != 8 ) {
      this.value = this.value + ' ';
    } else {
      output.innerHTML = '';
    }
  }

  code_input.onkeyup = function(e) {
    if(this.value.length == 3 && e.keyCode != 8) {  // 8 退格键键码
      this.value = this.value + ' ';
    } else if( this.value.length == 8 && e.keyCode != 8 ) {
      this.value = this.value + ' ';
    } else {
      output.innerHTML = '';
    }
  }


  get_ticket_btn.onclick = function () {
    get_ticket_confirm.style.display = "block";
  }

///////////////取消取票//////////////////
  cancel_btn.onclick = function () {
    get_ticket_confirm.style.display = "none";
  }

///////////////确认取票//////////////////
  confirm_btn.onclick = function () {
    var code = trans_num(code_input.value), phone_num = trans_num(phone_input.value);
    console.log(code, phone_num);
    $.post(global_api.get_ticket, {ticketCode:code, phoneNum:phone_num}, function(result) {
      console.log(result);
      var movie_id = result.movieOnShowId;

      $.get(global_api.get_movie_info + result.movieOnShowId, function(data) {
        console.log(data);

        // get movie detial
        $.get(global_api.get_movie_detail + data.movieId, function(detial) {
            console.log(detial);
          // get hall detial
          $.get(global_api.get_hall_info + data.cinemaHallId, function(hallInfo) {
            console.log(hallInfo);
            // get cinema detial
            $.get(global_api.get_cinema_info + hallInfo.cinemaId, function(cinemaInfo) {
              console.log(cinemaInfo);

///////////////*begin your show*////////////////////
        var time_str = data.showDate.split("-");
        var seat_str = "";
        for(var i = 0; i < result.seats.length; i++) {
            seat_str = seat_str + result.seats[i][0] + "&nbsp;排" + 
                       result.seats[i][1] + "&nbsp;座&nbsp;&nbsp;&nbsp;&nbsp;";
        }
///
        final_movie.innerHTML = detial.title;
        final_hall_cinema.innerHTML = cinemaInfo.cinemaName;
        final_hall_room.innerHTML = hallInfo.hallName;
        final_date.innerHTML = parseInt(time_str[1]) + "&nbsp;月&nbsp;" + 
                               parseInt(time_str[2]) + "&nbsp;日&nbsp;&nbsp;&nbsp;&nbsp;";
        final_time.innerHTML = data.showTime.slice(0,5);
        final_seat.innerHTML = seat_str;

        input_container.style.display = "none";
        get_ticket_confirm.style.display = "none";
        final_container.style.display = "block";
///////////////*end your show*/////////////////////

            }).error(function() {
              console.log("error in get cinema detial");
            });

          }).error(function() {
            console.log("error in get hall detial");
          });
        }).error(function() {
          console.log("error in get movie detial");
        });
      }).error(function() {
        console.log("error in get movieOnShowId information");
      });

    }).error(function() {
      console.log("error in input code or phone number");
    });
  }


///------------------------- 查票开始 ------------------------------///

check_ticket_btn.onclick = function () {
  var code = trans_num(code_input.value), phone_num = trans_num(phone_input.value);
    console.log(code, phone_num);
   // $.get(global_api.check_ticket + "?" + "ticketCode=" +code + "&&" + "phoneNum="+phone_num, function(result) {
   $.post(global_api.check_ticket, {ticketCode:code, phoneNum:phone_num}, function(result) {
      console.log(result);

      $.get(global_api.get_movie_info + result.movieOnShowId, function(data) {
        console.log(data);

        // get movie detial
        $.get(global_api.get_movie_detail + data.movieId, function(detial) {
            console.log(detial);
          // get hall detial
          $.get(global_api.get_hall_info + data.cinemaHallId, function(hallInfo) {
            console.log(hallInfo);
            // get cinema detial
            $.get(global_api.get_cinema_info + hallInfo.cinemaId, function(cinemaInfo) {
              console.log(cinemaInfo);

///////////////*begin your show*////////////////////
        var time_str = data.showDate.split("-");
        var seat_str = "";
        for(var i = 0; i < result.seats.length; i++) {
            seat_str = seat_str + result.seats[i][0] + "&nbsp;排" + 
                       result.seats[i][1] + "&nbsp;座&nbsp;&nbsp;&nbsp;&nbsp;";
        }
///
        final_movie.innerHTML = detial.title;
        final_hall_cinema.innerHTML = cinemaInfo.cinemaName;
        final_hall_room.innerHTML = hallInfo.hallName;
        final_date.innerHTML = parseInt(time_str[1]) + "&nbsp;月&nbsp;" + 
                               parseInt(time_str[2]) + "&nbsp日&nbsp;&nbsp;&nbsp;&nbsp;";
        final_time.innerHTML = data.showTime.slice(0,5);
        final_seat.innerHTML = seat_str;

        if( result.valid == true) {
          final_state.innerHTML = "未取票";
        } else {
          final_state.innerHTML = "已取票";
        }

        input_container.style.display = "none";
        get_ticket_confirm.style.display = "none";
        final_container.style.display = "block";
///////////////*end your show*/////////////////////

            }).error(function() {
              console.log("error in get cinema detial");
            });

          }).error(function() {
            console.log("error in get hall detial");
          });
        }).error(function() {
          console.log("error in get movie detial");
        });
      }).error(function() {
        console.log("error in get movieOnShowId information");
      });

}).error(function() {
      console.log("error in input code or phone number");
    });
}


///------------------------- 查票结束 ------------------------------///



  function trans_num(str) {
    var temp = "";
    var re = /[0-9]/;
    for (var i =0 ; i < str.length; i++) {
      if (re.test(str[i])) {
        temp += str[i];
      }
    }
    return temp;
  }

});