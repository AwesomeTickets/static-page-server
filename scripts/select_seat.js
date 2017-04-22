$(document).ready(function() {
  const global_api = {
    movie_info: 'http://120.25.76.106/resource/movie/',
    seat_layout: 'http://120.25.76.106/resource/cinema_hall/',
    unavailable: 'http://120.25.76.106/resource/seat/unavailable',
    movie_on_show: 'http://120.25.76.106/resource/movie_on_show',
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
  $.get(global_api.movie_info + movieID, function(data, textStatus) {
    const movie_info = data;
    console.log('movie_info: ', movie_info);
    $.get(global_api.movie_on_show, {movieID: movieID, cinemaHallID: cinemaHallID, showDate: showDate, showTime: showTime}, function(data, textStatus) {
      const movie_on_show = data;
      console.log('movie_on_show: ', movie_on_show);
      let movie_info_poster = document.getElementById('movie_info_poster');
      movie_info_poster.src = movie_info.posterSmall;
    })
  })
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