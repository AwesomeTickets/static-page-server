import "babel-polyfill";

$(document).ready(function() {
  const global_api = {
    movie_info: 'http://120.25.76.106/resource/movie/',
    seat_layout: 'http://120.25.76.106/resource/cinema-hall/',
    unavailable: 'http://120.25.76.106/resource/seat/unavailable',
    movie_on_show: 'http://120.25.76.106/resource/movie-on-show',
    cinema: 'http://120.25.76.106/resource/cinema/',
    cinema_hall: 'http://120.25.76.106/resource/cinema-hall/',
    day: 'http://120.25.76.106/resource/movie-on-show/day',
    day_times: 'http://120.25.76.106/resource/movie-on-show/',
  }

  const cinemaHallId = location.href.split('?')[1].split('&')[0].split('=')[1];
  const movieOnShowId = location.href.split('?')[1].split('&')[1].split('=')[1];
  const movieId = location.href.split('?')[1].split('&')[2].split('=')[1];
  const showDate = location.href.split('?')[1].split('&')[3].split('=')[1];
  const showTime = location.href.split('?')[1].split('&')[4].split('=')[1];
  let cinemaId = 0,
    changedMovieOnShowId = 0,
    changedCinemaHallId = 0;

  /*点击LOGO回到主页开始*/
  let head_bar_img = document.getElementById('head_bar_img');
  head_bar_img.onclick = function() {
    window.location = '../index.html';
  }
  /*点击LOGO回到主页结束*/

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
    hint_dialog = document.getElementById('hint_dialog');

  let select_seats = {},
    global_movie_price = 0;

  // 获取电影信息
  $.get(global_api.movie_info + movieId, function(data, textStatus) {
    const movie_info = data;
    // 获取电影排期
    $.get(global_api.movie_on_show, {movieId: movieId, cinemaHallId: cinemaHallId, showDate: showDate, showTime: showTime}, function(data, textStatus) {
      const movie_on_show = data;
      movie_info_poster.src = movie_info.posterSmall;
      movie_info_title.innerHTML = movie_info.title;
      movie_info_lang_and_movie_type.innerHTML = movie_on_show.lang + ' ' + movie_info.movieType;
      movie_info_length.innerHTML = movie_info.length + '分钟';
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
      movie_info_show_date.innerHTML = month_tmp + ' 月 ' + day_tmp + ' 日';
      movie_info_show_time.innerHTML = showTime.slice(0,2) + ' : ' + showTime.slice(3, 5);
      global_movie_price = movie_on_show.price;
      movie_info_price.innerHTML = '￥' + global_movie_price + ' × 0张';
      movie_info_total_price.innerHTML = '￥0';
    })
  })
  /*电影信息部分 结束*/


  /*选择座位部分开始*/
  // 根据收到的字符串生成大布局矩阵
  $.get(global_api.seat_layout + cinemaHallId + '/seat-layout', function(data, textStatus) {
    const seat_layout = data;
    let select_seat_layout_matrix = seat_layout.seatLayout.split(','),
      select_seat_row_count = select_seat_layout_matrix.length,
      select_seat_column_count = select_seat_layout_matrix[0].length,
      select_seat_fragment = document.createDocumentFragment(),
      select_seat = document.getElementById('select_seat'),
      select_seat_dot_line = document.getElementById('select_seat_dot_line');

    for (let i = 1; i <= select_seat_row_count; i++) {
      let tmpK = 1;
      let select_seat_row = document.createElement('div');
      select_seat_row.className = 'select_seat_row';
      let select_seat_row_number = document.createElement('div');
      select_seat_row_number.className = 'select_seat_row_number';
      select_seat_row_number.innerHTML = i;
      let select_seat_seats = document.createElement('div');
      select_seat_seats.className = 'select_seat_seats';
      select_seat_seats.style.width = select_seat_column_count * 28 + 'px'; 

      for (let j = 1; j <= select_seat_column_count; j++) {
        let select_seat_seats_item = document.createElement('div');
        select_seat_seats_item.className = 'select_seat_seats_item';
        select_seat_seats_item.id = 'select_seat_' + i + '_' + j;


        if (select_seat_layout_matrix[i - 1].slice(j - 1, j) == 1) {
          select_seat_seats_item.style.backgroundImage = 'url(\'/static/pictures/assets/seats/available.png\')';
          select_seat_seats_item.className = 'select_seat_seats_item select_seat_seats_item_avaliable';
          select_seat_seats_item.setAttribute('name', 'select_seat_' + i + '_' + tmpK)
          tmpK++;
        }
        select_seat_seats.appendChild(select_seat_seats_item);
      }
      select_seat_row.appendChild(select_seat_row_number);
      select_seat_row.appendChild(select_seat_seats);
      select_seat_fragment.appendChild(select_seat_row);
    }

    select_seat_dot_line.style.height = 40 * select_seat_row_count + 10 + 'px';
    select_seat.appendChild(select_seat_fragment);

    // 将不可选座位的图标改为灰色
    $.get(global_api.unavailable, {movieOnShowId: movieOnShowId}, function(data, textStatus) {
      const unavailable = data;
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
    })

    // 点击选座位
    select_seat.onclick = function(event) {
      if (event.target.className == 'select_seat_seats_item select_seat_seats_item_avaliable' && event.target.id.slice(0, 12) == 'select_seat_') {
        if (Object.keys(select_seats).length < 4) {
          if (event.target.style.backgroundImage != '') {
            event.target.className = 'select_seat_seats_item select_seat_seats_item_select';
            select_seats[event.target.id] = event.target.getAttribute('name').split('_')[2] + ' 排 ' + event.target.getAttribute('name').split('_')[3] + ' 座';
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
      movie_info_price.innerHTML = '￥' + global_movie_price + ' × ' + arrTmp.length + '张';
      movie_info_total_price.innerHTML = '￥' + global_movie_price * arrTmp.length;
      if (movie_info_seats.childNodes.length != 0) {
        movie_info_order.className = '';
      } else if (movie_info_seats.childNodes.length == 0) {
        movie_info_order.className = 'nonclickable';
        movie_info_seats.innerHTML = '未选座';
      }
    }

    // 隐藏更改场次弹框
    function hide_movie_info_change_show_time_dialog() {
      movie_info_change_show_time_dialog_triangle.style.display = 'none';
      movie_info_change_show_time_dialog.style.display = 'none';
      movie_info_change_show_time.innerHTML = '更改场次';   
    }

    let showTimeTmp = '';

    // 点击更改场次按钮，显示更改场次的框
    movie_info_change_show_time.onclick = function(event) {
      if (movie_info_change_show_time.innerHTML == '更改场次') {
        movie_info_change_show_time_dialog_triangle.style.display = 'block';
        movie_info_change_show_time_dialog.style.display = 'block';
        movie_info_change_show_time.innerHTML = '确定';

        if (movie_info_change_show_time_dialog.childNodes.length == 0) {
          // 获取电影日排期 
          $.get(global_api.day, {showDate: showDate, cinemaId: cinemaId, movieId: movieId}, function(data, textStatus) {
            const day = data;
            for (let i = 0; i < day.count; i++) {
              // 获取电影排期
              $.get(global_api.day_times + day.data[i], function(data, textStatus) {
                const day_times = data;
                let movie_info_change_show_time_dialog_item = document.createElement('div');
                movie_info_change_show_time_dialog_item.className = 'movie_info_change_show_time_dialog_item';
                movie_info_change_show_time_dialog_item.innerHTML = day_times.showTime.slice(0, 5);
                showTimeTmp = day_times.showTime.slice(0, 5);
                movie_info_change_show_time_dialog_item.id = 'movie_info_change_show_time_dialog_item_' + day_times.showTime.split(':')[0] + '_' + day_times.showTime.split(':')[1] + '_' + day_times.showTime.split(':')[2] + '_' + day_times.price + '_' + day_times.movieOnShowId;  
                movie_info_change_show_time_dialog.appendChild(movie_info_change_show_time_dialog_item);
                if (day_times.movieOnShowId == movieOnShowId) {
                  movie_info_change_show_time_dialog_item.className += ' movie_info_change_show_time_dialog_item_active';
                }
                if (movie_info_change_show_time_dialog.childNodes.length == day.count) {
                  sort_select_time_items();
                }
              })
            }
          })
        }
      } else if (movie_info_change_show_time.innerHTML == '确定') {
        hide_movie_info_change_show_time_dialog();        
      }
    }

    // 点击某个场次进行场次变化
    movie_info_change_show_time_dialog.onclick = function(event) {
      if (event.target.className == 'movie_info_change_show_time_dialog_item') {
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

        $.get(global_api.movie_on_show + '/' + changedMovieOnShowId, function(data, textStatus) {
          const movie_on_show = data;
          changedCinemaHallId = movie_on_show.cinemaHallId;
          // 变化影厅名
          $.get(global_api.cinema_hall + changedCinemaHallId, function(data, textStatus) {
            const cinema_hall = data;
            movie_info_cinema_hall_name.innerHTML = cinema_hall.hallName;
          })
          $.get(global_api.seat_layout + changedCinemaHallId + '/seat-layout', function(data, textStatus) {
            const seat_layout = data;
            let select_seat_layout_matrix = seat_layout.seatLayout.split(','),
              select_seat_row_count = select_seat_layout_matrix.length,
              select_seat_column_count = select_seat_layout_matrix[0].length,
              select_seat_fragment = document.createDocumentFragment(),
              select_seat = document.getElementById('select_seat'),
              select_seat_dot_line = document.getElementById('select_seat_dot_line');

            for (let i = 1; i <= select_seat_row_count; i++) {
              let tmpK = 1;
              let select_seat_row = document.createElement('div');
              select_seat_row.className = 'select_seat_row';
              let select_seat_row_number = document.createElement('div');
              select_seat_row_number.className = 'select_seat_row_number';
              select_seat_row_number.innerHTML = i;
              let select_seat_seats = document.createElement('div');
              select_seat_seats.className = 'select_seat_seats';
              select_seat_seats.style.width = select_seat_column_count * 28 + 'px'; 

              for (let j = 1; j <= select_seat_column_count; j++) {
                let select_seat_seats_item = document.createElement('div');
                select_seat_seats_item.className = 'select_seat_seats_item';
                select_seat_seats_item.id = 'select_seat_' + i + '_' + j;


                if (select_seat_layout_matrix[i - 1].slice(j - 1, j) == 1) {
                  select_seat_seats_item.style.backgroundImage = 'url(\'/static/pictures/assets/seats/available.png\')';
                  select_seat_seats_item.className = 'select_seat_seats_item select_seat_seats_item_avaliable';
                  select_seat_seats_item.setAttribute('name', 'select_seat_' + i + '_' + tmpK)
                  tmpK++;
                }
                select_seat_seats.appendChild(select_seat_seats_item);
              }
              select_seat_row.appendChild(select_seat_row_number);
              select_seat_row.appendChild(select_seat_seats);
              select_seat_fragment.appendChild(select_seat_row);
            }

            select_seat_dot_line.style.height = 40 * select_seat_row_count + 10 + 'px';
            select_seat.appendChild(select_seat_fragment);

            // 将不可选座位的图标改为灰色
            $.get(global_api.unavailable, {movieOnShowId: changedMovieOnShowId}, function(data, textStatus) {
              const unavailable = data;
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
            })
          })
        })
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

    // 点击‘重新选座’隐藏弹出框
    hint_dialog.onclick = function(event) {
      if (event.target.id == 'hint_dialog_button') {
        hint_dialog.style.display = 'none';
      }
    }

    // 清除选座位区的所有座位
    function clear_all_seats() {
      let lengthTmp = select_seat.childNodes.length;
      for (let i = 2; i < lengthTmp; i++) {
        select_seat.removeChild(select_seat.childNodes[2]);
      }
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
      movie_info_price.innerHTML = '￥' + global_movie_price + ' × 0张';
      movie_info_total_price.innerHTML = '￥0';
    }

  })
  /*选择座位部分结束*/
});