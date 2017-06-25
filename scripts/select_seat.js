import "babel-polyfill";

$(document).ready(function() {
  const global_api = {
    movie_info: `${global_url}/resource/movie/`,
    seat_layout: `${global_url}/resource/cinema-hall/`,
    unavailable: `${global_url}/resource/seat/unavailable`,
    movie_on_show: `${global_url}/resource/movie-on-show`,
    cinema: `${global_url}/resource/cinema/`,
    cinema_hall: `${global_url}/resource/cinema-hall/`,
    day: `${global_url}/resource/movie-on-show/day`,
    day_times: `${global_url}/resource/movie-on-show/`,
    login: `${global_url}/resource/session/`,
    checkLogin: `${global_url}/resource/session/check`,
  }

  const cinemaHallId = location.href.split('?')[1].split('&')[0].split('=')[1],
    movieOnShowId = location.href.split('?')[1].split('&')[1].split('=')[1],
    movieId = location.href.split('?')[1].split('&')[2].split('=')[1],
    showDate = location.href.split('?')[1].split('&')[3].split('=')[1],
    showTime = location.href.split('?')[1].split('&')[4].split('=')[1];
  let cinemaId = 0,
    changedMovieOnShowId = 0,
    changedCinemaHallId = 0,
    select_seats = {},
    global_movie_price = 0,
    showTimeTmp = '';

  /*电影信息部分 开始*/
  let movie_info_poster = document.getElementById('movie_info_poster'),
    movie_info_title = document.getElementById('movie_info_title'),
    movie_info_lang_and_movie_type = document.getElementById('movie_info_lang_and_movie_type'),
    movie_info_length = document.getElementById('movie_info_length'),
    movie_info_cinema_name = document.getElementById('movie_info_cinema_name'),
    movie_info_cinema_hall_name = document.getElementById('movie_info_cinema_hall_name'),
    movie_info_show_date = document.getElementById('movie_info_show_date'),
    movie_info_change_show_time = document.getElementById('movie_info_change_show_time'),
    movie_info_show_time = document.getElementById('movie_info_show_time'),
    movie_info_change_show_time_dialog_triangle = document.getElementById('movie_info_change_show_time_dialog_triangle'),
    movie_info_change_show_time_dialog = document.getElementById('movie_info_change_show_time_dialog'),
    movie_info_seats = document.getElementById('movie_info_seats'),
    movie_info_price = document.getElementById('movie_info_price'),
    movie_info_total_price = document.getElementById('movie_info_total_price'),
    movie_info_order = document.getElementById('movie_info_order'),
    hint_dialog = document.getElementById('hint_dialog'),
    login_dialog = document.getElementById('login_dialog'),
    login_button = document.getElementById('login_button'),
    login_close = document.getElementById('login_close'),
    login_error = document.getElementById('login_error'),
    login_phone = $('.form-group')[0].childNodes[1],
    login_phone_text = $('.form-group')[0].childNodes[0],
    login_password = $('.form-group')[1].childNodes[1],
    login_password_text = $('.form-group')[1].childNodes[0];

  // 获取电影信息
  function get_movie_info() {
    return new Promise((resolve, reject) => {
      $.get(global_api.movie_info + movieId, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取电影排期
  function get_movie_on_show() {
    return new Promise((resolve, reject) => {
      $.get(global_api.movie_on_show, {movieId: movieId, cinemaHallId: cinemaHallId, showDate: showDate, showTime: showTime}, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 将电影信息呈现在页面上
  function show_movie_info(movie_info, movie_on_show) {
    movie_info_poster.src = movie_info.posterSmall;
    movie_info_title.innerHTML = movie_info.title;
    movie_info_lang_and_movie_type.innerHTML = movie_on_show.lang + ' ' + movie_info.movieType;
    movie_info_length.innerHTML = `${movie_info.length}分钟`;
    $.get(global_api.cinema_hall + cinemaHallId, function(data, textStatus) {
      const cinema_hall = data;
      movie_info_cinema_hall_name.innerHTML = cinema_hall.hallName;
      cinemaId = cinema_hall.cinemaId;
      $.get(global_api.cinema + cinemaId, function(data, textStatus) {
        const cinema = data;
        movie_info_cinema_name.innerHTML = cinema.cinemaName;
      })
    })
    let month_tmp = showDate.split('-')[1],
      day_tmp = showDate.split('-')[2];
    if (month_tmp.slice(0, 1) == '0') {
      month_tmp = month_tmp.slice(1, 2);
    }
    if (day_tmp.slice(0, 1) == '0') {
      day_tmp = day_tmp.slice(1, 2);
    }
    movie_info_show_date.innerHTML = `${month_tmp} 月 ${day_tmp} 日`;
    movie_info_show_time.innerHTML = showTime.slice(0,2) + ' : ' + showTime.slice(3, 5);
    global_movie_price = movie_on_show.price;
    movie_info_price.innerHTML = `￥${global_movie_price} × 0张`;
    movie_info_total_price.innerHTML = '￥0';
  }

  async function movie_info_part() {
    // 获取电影信息
    let movie_info = await get_movie_info();
    // 获取电影排期
    let movie_on_show = await get_movie_on_show();
    // 将电影信息呈现在页面上
    show_movie_info(movie_info, movie_on_show);
  }
  movie_info_part();
  /*电影信息部分 结束*/


  /*选择座位部分开始*/
  let select = document.getElementById('select'),
    select_seat = document.getElementById('select_seat'),
    select_seat_dot_line = document.getElementById('select_seat_dot_line'),
    select_seat_numbers = document.getElementById('select_seat_numbers'),
    select_seat_layout_matrix = '',
    select_seat_row_count = 0,
    select_seat_column_count = 0;

  // 获取影厅座位布局
  function get_seat_layout(cinemaHallId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.seat_layout + cinemaHallId + '/seat-layout', function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 根据座位布局初始化一些变量
  function initial_viaribles_with_seat_layout(seat_layout) {
    select_seat_layout_matrix = seat_layout.seatLayout.split(',');
    select_seat_row_count = select_seat_layout_matrix.length;
    select_seat_column_count = select_seat_layout_matrix[0].length;
  }

  // 根据收到的字符串生成大布局矩阵
  function show_select_seat_layout_matrix(seat_layout, select_seat_layout_matrix, select_seat_row_count, select_seat_column_count) {
    // select_seat = document.getElementById("select_seat");
    let select_seat_numbers_fragment = document.createDocumentFragment();
    for (let i = 1; i <= select_seat_row_count; i++) {
      let select_seat_number = document.createElement('div');
      select_seat_number.className = 'select_seat_number';
      select_seat_number.innerHTML = i;
      select_seat_numbers_fragment.appendChild(select_seat_number);
    }
    select_seat_numbers.appendChild(select_seat_numbers_fragment);


    let select_seat_fragment = document.createDocumentFragment();

    for (let i = 1; i <= select_seat_row_count; i++) {
      let tmpK = 1;
      let select_seat_row = document.createElement('div');
      select_seat_row.className = 'select_seat_row';
      // let select_seat_row_number = document.createElement('div');
      // select_seat_row_number.className = 'select_seat_row_number';
      // select_seat_row_number.innerHTML = i;
      let select_seat_seats = document.createElement('div');
      select_seat_seats.className = 'select_seat_seats';
      select_seat_seats.style.width = `${select_seat_column_count * 28}px`;
      select_seat_seats.style.height = `${select_seat_row_count * 60}px`;

      for (let j = 1; j <= select_seat_column_count; j++) {
        let select_seat_seats_item = document.createElement('div');
        select_seat_seats_item.className = 'select_seat_seats_item';
        select_seat_seats_item.id = `select_seat_${i}_${j}`;
        if (select_seat_layout_matrix[i - 1].slice(j - 1, j) == 1) {
          select_seat_seats_item.style.backgroundImage = 'url(\'/static/pictures/assets/seats/available.png\')';
          select_seat_seats_item.className = 'select_seat_seats_item select_seat_seats_item_avaliable';
          select_seat_seats_item.setAttribute('name', `select_seat_${i}_${tmpK}`)
          tmpK++;
        }
        select_seat_seats.appendChild(select_seat_seats_item);
      }
      // select_seat_row.appendChild(select_seat_row_number);
      select_seat_row.appendChild(select_seat_seats);
      select_seat_fragment.appendChild(select_seat_row);
    }

    select_seat_dot_line.style.height = `${40 * select_seat_row_count + 10}px`;
    select_seat.appendChild(select_seat_fragment);
  }

  // 获取不可用座位信息
  function get_unavailable(movieOnShowId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.unavailable, {movieOnShowId: movieOnShowId}, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 将不可选座位的图标改为灰色
  function show_unavailable_seats(unavailable, select_seat_layout_matrix) {
    for (let i = 0; i < unavailable.data.length; i++) {
      let select_seat_this_row_array = [],
        tmpObj = {};
      for (let k = 0; k < select_seat_layout_matrix[unavailable.data[i][0] - 1].length; k++) {
        select_seat_this_row_array.push((select_seat_layout_matrix[unavailable.data[i][0] - 1]).slice(k, k + 1));
      }
      for (let j = 0; j < select_seat_this_row_array.length; j++) {
        if (select_seat_this_row_array[j] == 1) {
          tmpObj[j] = '1';
        }
      }
      let tmpArr = Object.keys(tmpObj);
      document.getElementById('select_seat_' + unavailable.data[i][0] + '_' + (parseInt(tmpArr[unavailable.data[i][1] - 1]) + 1)).className = 'select_seat_seats_item select_seat_seats_item_unavailable';
    }
  }

  // 获取电影排期（根据Id）
  function get_movie_on_show_by_id(changedMovieOnShowId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.movie_on_show + '/' + changedMovieOnShowId, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取影厅信息（不含座位布局）
  function get_cinema_hall(changedCinemaHallId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.cinema_hall + changedCinemaHallId, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取电影日排期
  function get_day(showDate, cinemaId, movieId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.day, {showDate: showDate, cinemaId: cinemaId, movieId: movieId}, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取电影排期
  function get_day_times(day, i) {
    return new Promise((resolve, reject) => {
      $.get(global_api.day_times + day.data[i], function(data, textStatus) {
        resolve(data);
      });
    })
  }

  function set_custom_scroll_bar() {
    $("#select_seat").mCustomScrollbar({
      axis:"x", // horizontal scrollbar
      theme: "3d-dark",
      setLeft: "70px",  //初始滚动距离,可再调整到初始滚动到中间
      scrollButtons:{ enable: true },
      keyboard:{ enable: true },
      live: true,
      callbacks:{
        onScrollStart: function(){
          $('.mCSB_buttonLeft').hide();
          $('.mCSB_buttonRight').hide();
        },
        onTotalScroll: function(){
          $('.mCSB_buttonRight').hide();
        },
        onTotalScrollBack: function(){
          $('.mCSB_buttonLeft').hide();
        },
        onScroll: function(){
          $('.mCSB_buttonLeft').show();
          $('.mCSB_buttonRight').show();
        },
      },
    });
  }

  async function select_seat_part() {
    // 获取影厅座位布局
    let seat_layout = await get_seat_layout(cinemaHallId);
    // 根据座位布局初始化一些变量
    initial_viaribles_with_seat_layout(seat_layout);
    // 根据收到的字符串生成大布局矩阵
    show_select_seat_layout_matrix(seat_layout, select_seat_layout_matrix, select_seat_row_count, select_seat_column_count);
    // 获取不可用座位信息
    let unavailable = await get_unavailable(movieOnShowId);
    // 将不可选座位的图标改为灰色
    show_unavailable_seats(unavailable, select_seat_layout_matrix);
    set_custom_scroll_bar();
    select_seat = document.getElementById("select_seat");
    // 点击选座位
    select_seat.onclick = function(event) {
      if (event.target.className == 'select_seat_seats_item select_seat_seats_item_avaliable' && event.target.id.slice(0, 12) == 'select_seat_') {
        if (Object.keys(select_seats).length < 4) {
          if (event.target.style.backgroundImage != '') {
            event.target.className = 'select_seat_seats_item select_seat_seats_item_select';
            select_seats[event.target.id] = `${event.target.getAttribute('name').split('_')[2]} 排 ${event.target.getAttribute('name').split('_')[3]} 座`;
            show_select_seats();
            hide_movie_info_change_show_time_dialog();
          }
        } else if (Object.keys(select_seats).length >= 4) {
          // alert('最多选择四个座位');
          hint_dialog.style.display = 'block';
          hide_movie_info_change_show_time_dialog();
        }
      } else if (event.target.className == 'select_seat_seats_item select_seat_seats_item_select' && event.target.id.slice(0, 12) == 'select_seat_') {
        event.target.className = 'select_seat_seats_item select_seat_seats_item_avaliable';
        delete select_seats[event.target.id];
        show_select_seats();
        hide_movie_info_change_show_time_dialog();
      }
    }
    // 点击更改场次按钮，显示更改场次的框
    movie_info_change_show_time.onclick = async function(event) {
      if (movie_info_change_show_time.innerHTML == '更改场次') {
        // 显示更改场次弹框
        show_movie_info_change_show_time_dialog();
        if (movie_info_change_show_time_dialog.childNodes.length == 0) {
          // 获取电影日排期
          let day = await get_day(showDate, cinemaId, movieId);
          for (let i = 0; i < day.count; i++) {
            // 获取电影排期
            let day_times = await get_day_times(day, i);
            // 将该电影的各个场次显示在弹出框中
            show_movie_info_change_show_time_dialog_items(day, day_times);
          }
        }
      } else if (movie_info_change_show_time.innerHTML == '确定') {
        // 隐藏更改场次弹框
        hide_movie_info_change_show_time_dialog();
      }
    }
    // 点击某个场次进行场次变化
    movie_info_change_show_time_dialog.onclick = async function(event) {
      if (event.target.className == 'movie_info_change_show_time_dialog_item') {
        change_item_initial(event);
        // 获取电影排期（根据Id）
        let movie_on_show = await get_movie_on_show_by_id(changedMovieOnShowId);
        changedCinemaHallId = movie_on_show.cinemaHallId;
        // 获取影厅信息（不含座位布局）
        let cinema_hall = await get_cinema_hall(changedCinemaHallId);
        // 变化影厅名
        movie_info_cinema_hall_name.innerHTML = cinema_hall.hallName;
        // 根据收到的字符串生成大布局矩阵
        let seat_layout = await get_seat_layout(changedCinemaHallId);
        initial_viaribles_with_seat_layout(seat_layout);
        show_select_seat_layout_matrix(seat_layout, select_seat_layout_matrix, select_seat_row_count, select_seat_column_count);
        // 将不可选座位的图标改为灰色
        let unavailable = await get_unavailable(changedMovieOnShowId);
        show_unavailable_seats(unavailable, select_seat_layout_matrix);
        set_custom_scroll_bar();
        select_seat.onclick = function(event) {
          if (event.target.className == 'select_seat_seats_item select_seat_seats_item_avaliable' && event.target.id.slice(0, 12) == 'select_seat_') {
            if (Object.keys(select_seats).length < 4) {
              if (event.target.style.backgroundImage != '') {
                event.target.className = 'select_seat_seats_item select_seat_seats_item_select';
                select_seats[event.target.id] = `${event.target.getAttribute('name').split('_')[2]} 排 ${event.target.getAttribute('name').split('_')[3]} 座`;
                show_select_seats();
                hide_movie_info_change_show_time_dialog();
              }
            } else if (Object.keys(select_seats).length >= 4) {
              // alert('最多选择四个座位');
              hint_dialog.style.display = 'block';
              hide_movie_info_change_show_time_dialog();
            }
          } else if (event.target.className == 'select_seat_seats_item select_seat_seats_item_select' && event.target.id.slice(0, 12) == 'select_seat_') {
            event.target.className = 'select_seat_seats_item select_seat_seats_item_avaliable';
            delete select_seats[event.target.id];
            show_select_seats();
            hide_movie_info_change_show_time_dialog();
          }
        }
        // $('#select_seat').mCustomScrollbar("destroy");
      }
    }
  }

  select_seat_part();

  // 点击‘重新选座’隐藏弹出框
  hint_dialog.onclick = function(event) {
    if (event.target.id == 'hint_dialog_button') {
      hint_dialog.style.display = 'none';
    }
  }

  // 点击某个场次项目，进行类名变更，清除已选座位信息
  function change_item_initial(event) {
    let lengthTmp = event.target.parentNode.childNodes.length;
    for (let i = 0; i < lengthTmp; i++) {
      event.target.parentNode.childNodes[i].className = 'movie_info_change_show_time_dialog_item';
    }
    event.target.className = 'movie_info_change_show_time_dialog_item movie_info_change_show_time_dialog_item_active';
    showTimeTmp = event.target.id.split('_')[7] + ':' + event.target.id.split('_')[8];
    global_movie_price = event.target.id.split('_')[10];
    changedMovieOnShowId = parseInt(event.target.id.split('_')[11]);

    movie_info_show_time.innerHTML = showTimeTmp;
    show_select_seats();
    clear_all_seats();
    clear_all_selected_seats();
  }

  // 将该电影的各个场次显示在弹出框中
  function show_movie_info_change_show_time_dialog_items(day, day_times) {
    let movie_info_change_show_time_dialog_item = document.createElement('div');
    movie_info_change_show_time_dialog_item.className = 'movie_info_change_show_time_dialog_item';
    movie_info_change_show_time_dialog_item.innerHTML = day_times.showTime.slice(0, 5);
    showTimeTmp = day_times.showTime.slice(0, 5);
    movie_info_change_show_time_dialog_item.id = `movie_info_change_show_time_dialog_item_${day_times.showTime.split(':')[0]}_${day_times.showTime.split(':')[1]}_${day_times.showTime.split(':')[2]}_${day_times.price}_${day_times.movieOnShowId}`;
    movie_info_change_show_time_dialog.appendChild(movie_info_change_show_time_dialog_item);
    if (day_times.movieOnShowId == movieOnShowId) {
      movie_info_change_show_time_dialog_item.className += ' movie_info_change_show_time_dialog_item_active';
    }
    if (movie_info_change_show_time_dialog.childNodes.length == day.count) {
      sort_select_time_items();
    }
  }

  // 将已选择的座位呈现到对应的地方，并显示价格和总价
  function show_select_seats() {
    let lengthTmp = movie_info_seats.childNodes.length;
    for (let i = 0; i < lengthTmp; i++) {
      movie_info_seats.removeChild(movie_info_seats.childNodes[0]);
    }
    let arrTmp = Object.keys(select_seats),
      movie_info_seats_item_fragment = document.createDocumentFragment();
    for (let i = 0; i < arrTmp.length; i++) {
      let movie_info_seats_item = document.createElement('div');
      movie_info_seats_item.className = 'movie_info_seats_item';
      movie_info_seats_item.innerHTML = select_seats[arrTmp[i]];
      movie_info_seats_item_fragment.appendChild(movie_info_seats_item);
    }
    movie_info_seats.appendChild(movie_info_seats_item_fragment);
    movie_info_price.innerHTML = `￥${global_movie_price} × ${arrTmp.length}张`;
    movie_info_total_price.innerHTML = `￥${global_movie_price * arrTmp.length}`;
    if (movie_info_seats.childNodes.length != 0) {
      movie_info_order.className = '';
    } else if (movie_info_seats.childNodes.length == 0) {
      movie_info_order.className = 'nonclickable';
      movie_info_seats.innerHTML = '未选座';
    }
  }
  // 将场次进行排序
  function sort_select_time_items() {
    let lengthTmp = movie_info_change_show_time_dialog.childNodes.length,
      objTmp = {};
    for (let i = 0; i < lengthTmp; i++) {
      objTmp[movie_info_change_show_time_dialog.childNodes[i].innerHTML.split(':')[0] + movie_info_change_show_time_dialog.childNodes[i].innerHTML.split(':')[1] + i] = movie_info_change_show_time_dialog.childNodes[i].id;
    }
    let arrTmp = Object.keys(objTmp);
    for (let i = 0; i < lengthTmp; i++) {
      for (let j = 0; j < lengthTmp - 1; j++) {
        if (movie_info_change_show_time_dialog.childNodes[j].id == objTmp[arrTmp[i]]) {
          movie_info_change_show_time_dialog.appendChild(movie_info_change_show_time_dialog.childNodes[j]);
          break;
        }
      }
    }
  }
  // 隐藏更改场次弹框
  function hide_movie_info_change_show_time_dialog() {
    movie_info_change_show_time_dialog_triangle.style.display = 'none';
    movie_info_change_show_time_dialog.style.display = 'none';
    movie_info_change_show_time.innerHTML = '更改场次';
  }
  // 显示更改场次弹框
  function show_movie_info_change_show_time_dialog() {
    movie_info_change_show_time_dialog_triangle.style.display = 'block';
    movie_info_change_show_time_dialog.style.display = 'block';
    movie_info_change_show_time.innerHTML = '确定';
  }
  // 清除已选座位信息
  function clear_all_selected_seats() {
    let lengthTmp = movie_info_seats.childNodes.length;
    for (let i = 0; i < lengthTmp; i++) {
      movie_info_seats.removeChild(movie_info_seats.childNodes[0]);
    }
    select_seats = {};
    movie_info_order.className = 'nonclickable';
    movie_info_seats.innerHTML = '未选座';
    movie_info_price.innerHTML = `￥${global_movie_price} × 0张`;
    movie_info_total_price.innerHTML = '￥0';
  }
  // 清除选座位区的所有座位
  function clear_all_seats() {
    let lengthTmp = select_seat.childNodes.length;
    for (let i = 0; i < lengthTmp; i++) {
      select_seat.removeChild(select_seat.childNodes[0]);
    }
    select.removeChild(select_seat);
    let select_seat2 = document.createElement('div');
    select_seat2.id = "select_seat";
    select.insertBefore(select_seat2, select_seat_hint);
    select_seat = document.getElementById("select_seat");
    lengthTmp = select_seat_numbers.childNodes.length;
    for (let i = 0; i < lengthTmp; i++) {
      select_seat_numbers.removeChild(select_seat_numbers.childNodes[0]);
    }
  }
  /*选择座位部分结束*/

  /* 添加确认按钮点击跳转 */
  movie_info_order.onclick = function(event) {
    if (movie_info_order.className == "nonclickable") return;
    checkLogin(event);
  }

  function getInfo(event) {
    if (movie_info_order.className == "nonclickable") return;
    var info_temp = event.target.baseURI.split('?')[1] + '&';
    var seats = document.getElementsByClassName("movie_info_seats_item");
    var str_temp = "";
    for(var i = 0; i < seats.length; i++) {
      for(var j = 0; j < seats[i].innerHTML.length; j++)
        if (seats[i].innerHTML[j] == '排') str_temp += '_';
        else if (seats[i].innerHTML[j] == '座');
        else if (seats[i].innerHTML[j] != '\ ') str_temp += seats[i].innerHTML[j];
      info_temp += (i == 0 ? '' : '-') + str_temp;
      str_temp = "";
    }
    window.location = './booking_ticket.html?'+info_temp;
  }

  // checkLogin
  function checkLogin(event) {
    $.ajax({
      url: global_api.checkLogin,
      type: "GET",
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
        if (data.phoneNum === '') {
          login_dialog.style.display = 'block';
          login_button.onclick = function(event) {
            event.preventDefault();
            login(login_phone.value, login_password.value, event);
          }
        } else {
          getInfo(event);
				}
      },
    });
  }

  // login_close
  function login(phone, pw, event) {
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
        getInfo(event);
      },
      error: function(xhr, status, error) {
        login_error.innerHTML = '手机号或密码错误。'
      },
    });
  }

  login_phone_text.style.color = '#E76456';
  login_phone.onfocus = function() {
    login_error.innerHTML = '';
    login_phone_text.style.color = '#E76456';
  }

  login_phone.onblur = function() {
    login_phone_text.style.color = '';
  }

  login_password.onfocus = function() {
    login_error.innerHTML = '';
    login_password_text.style.color = '#E76456';
  }

  login_password.onblur = function() {
    login_password_text.style.color = '';
  }

  // 注册
  const sign_up = document.getElementById('sign_up');
  sign_up.onclick = function() {
    window.location = './register_page.html';
  }

  // 关闭登录弹框
  login_close.onclick = function() {
    login_dialog.style.display = 'none';
  }
});
