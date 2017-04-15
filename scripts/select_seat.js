$(document).ready(function() {
  const global_api = {

  }

  /*模拟数据*/
  // 获取影厅座位布局
  const seat_layout = {
    "cinemaHallID": 11,
    // "seatLayout": '11111111,00111100,11011011,11110000,11111111',
    "seatLayout": "1111111111111111,1111111111111111,1111111111111111,0001111111111000,0001111111111000,0001111111111000,0001111111111000,1101111111111011,1101111111111011,1101111111111011"
  }

  // 获取不可用座位信息
  const unavailable = {
    "count": 3,
    "data": [[5, 3], [5, 4], [6, 3], [6, 4], [6, 5], [6, 6]],
  }
  /*模拟数据*/

  /*选择座位部分开始*/

  // 根据收到的字符串生成大布局矩阵
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
        console.log(select_seat_seats_item.style.backgroundImage);
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
  /*选择座位部分结束*/
});