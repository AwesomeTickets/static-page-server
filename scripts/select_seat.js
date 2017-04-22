$(document).ready(function() {
  const global_api = {
    movie_info: 'http://120.25.76.106/resource/movie/',
    seat_layout: 'http://120.25.76.106/resource/cinema_hall/',
    unavailable: 'http://120.25.76.106/resource/seat/unavailable',
    movie_on_show: 'http://120.25.76.106/resource/movie_on_show',
    cinema: 'http://120.25.76.106/resource/cinema/',
    cinema_hall: 'http://120.25.76.106/resource/cinema_hall/',
  }

  const cinemaHallID = location.href.split('?')[1].split('&')[0].split('=')[1];
  const movieOnShowID = location.href.split('?')[1].split('&')[1].split('=')[1];
  const movieID = location.href.split('?')[1].split('&')[2].split('=')[1];
  const showDate = location.href.split('?')[1].split('&')[3].split('=')[1];
  const showTime = location.href.split('?')[1].split('&')[4].split('=')[1];

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
    movie_info_show_time = document.getElementById('movie_info_show_time'),
    movie_info_change_show_time_dialog_triangle = document.getElementById('movie_info_change_show_time_dialog_triangle'),
    movie_info_change_show_time_dialog = document.getElementById('movie_info_change_show_time_dialog'),
    movie_info_seats = document.getElementById('movie_info_seats'),
    movie_info_price = document.getElementById('movie_info_price'),
    movie_info_total_price = document.getElementById('movie_info_total_price');

  $.get(global_api.movie_info + movieID, function(data, textStatus) {
    const movie_info = data;
    console.log('movie_info: ', movie_info);
    $.get(global_api.movie_on_show, {movieID: movieID, cinemaHallID: cinemaHallID, showDate: showDate, showTime: showTime}, function(data, textStatus) {
      const movie_on_show = data;
      console.log('movie_on_show: ', movie_on_show);
      movie_info_poster.src = movie_info.posterSmall;
      movie_info_title.innerHTML = movie_info.title;
      movie_info_lang_and_movie_type.innerHTML = movie_on_show.lang + ' ' + movie_info.movieType;
      movie_info_length.innerHTML = movie_info.length + '分钟';
      $.get(global_api.cinema_hall + cinemaHallID, function(data, textStatus) {
        const cinema_hall = data;
        movie_info_cinema_hall_name.innerHTML = cinema_hall.name;
        $.get(global_api.cinema + cinema_hall.cinemaID, function(data, textStatus) {
          const cinema = data;
          movie_info_cinema_name.innerHTML = cinema.name;
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
      movie_info_show_date.innerHTML = month_tmp + '月' + day_tmp + '日';
      movie_info_show_time.innerHTML = showTime.slice(0,5);
    })
  })

//  img#movie_info_poster
// div#movie_info_title 金刚狼3：殊死一战
// div#movie_info_lang_and_movie_type 英文 3D
// div#movie_info_length 130分钟
// div#movie_info_cinema_name 金逸珠江国际影城（大学城店）
// div#movie_info_cinema_hall_name 5号厅
// div#movie_info_show_date_hint 日期：
// div#movie_info_show_date 4月4日
// div#movie_info_show_time_hint 场次：
// div#movie_info_show_time 13：25
// button#movie_info_change_show_time 更改场次
// div#movie_info_change_show_time_dialog_triangle
// div#movie_info_change_show_time_dialog
//   div#movie_info_change_show_time_dialog_item1.movie_info_change_show_time_dialog_item 10:35
//   div#movie_info_change_show_time_dialog_item2.movie_info_change_show_time_dialog_item 12:35
//   div#movie_info_change_show_time_dialog_item3.movie_info_change_show_time_dialog_item 14:35
//   div#movie_info_change_show_time_dialog_item4.movie_info_change_show_time_dialog_item 16:35
//   div#movie_info_change_show_time_dialog_item4.movie_info_change_show_time_dialog_item 17:35
// div#movie_info_seats_hint 座位：
// div#movie_info_seats 5排6座 5排7座 5排8座 5排9座
// div#movie_info_price_hint 价格：
// div#movie_info_price ￥38 × 4张
// div#movie_info_total_price_hint 总价：
// div#movie_info_total_price ￥152
// button#movie_info_order 确认购票   
  /*电影信息部分 结束*/


  /*选择座位部分开始*/
  // 根据收到的字符串生成大布局矩阵
  $.get(global_api.seat_layout + cinemaHallID + '/seat_layout', function(data, textStatus) {
    const seat_layout = data;
    // console.log('seat_layout: ', seat_layout);
    let select_seat_layout_matrix = seat_layout.seatLayout.split(','),
      select_seat_row_count = select_seat_layout_matrix.length,
      select_seat_column_count = select_seat_layout_matrix[0].length,
      select_seat_fragment = document.createDocumentFragment(),
      select_seat = document.getElementById('select_seat'),
      select_seat_dot_line = document.getElementById('select_seat_dot_line');

    for (let i = 1; i <= select_seat_row_count; i++) {
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
        }
        select_seat_seats.appendChild(select_seat_seats_item);
      }
      select_seat_row.appendChild(select_seat_row_number);
      select_seat_row.appendChild(select_seat_seats);
      select_seat_fragment.appendChild(select_seat_row);
    }

    select_seat_dot_line.style.height = 40 * select_seat_row_count + 10 + 'px';
    select_seat.appendChild(select_seat_fragment);

    // 将不可选座位的图标改为红色
    $.get(global_api.unavailable, {movieOnShowID: movieOnShowID}, function(data, textStatus) {
      const unavailable = data;
      // console.log('unavailable: ', unavailable);
      for (let i = 0; i < unavailable.data.length; i++) {
        let select_seat_this_row_array = [...select_seat_layout_matrix[unavailable.data[i][0] - 1]],
          tmpObj = {};
        for (let j = 0; j < select_seat_this_row_array.length; j++) {
          if (select_seat_this_row_array[j] == 1) {
            tmpObj[j] = '1';
          }
        }
        let tmpArr = Object.keys(tmpObj);
        document.getElementById('select_seat_' + unavailable.data[i][0] + '_' + (parseInt(tmpArr[unavailable.data[i][1] - 1]) + 1)).className += ' select_seat_seats_item_unavailable';
      }
    })
  })
  /*选择座位部分结束*/
});