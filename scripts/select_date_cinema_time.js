import "babel-polyfill";

$(document).ready(function() {
  const global_api = {
    movie_info: `${global_url}/resource/movie/`,
    recent: `${global_url}/resource/movie-on-show/recent`,
    brief: `${global_url}/resource/movie-on-show/day/brief`,
    cinema: `${global_url}/resource/cinema/`,
    day: `${global_url}/resource/movie-on-show/day`,
    day_times: `${global_url}/resource/movie-on-show/`,
    cinema_hall: `${global_url}/resource/cinema-hall/`,
  }

  /*取下movieId*/
  const movieId = location.href.split('?')[1].split('#')[0].slice(8);
  /*取下movieId*/

  /*保存该电影的一些信息*/
  const global_movie_info = {
    length: 0,
    movieType: '',
  }
  /*保存该电影的一些信息*/

  window.location.hash = '#select_cinema';

  let select_date_initial_count = 1,
    select_date_initial_count_tmp = 1,
    select = document.getElementById('select'),
    select_cinema = document.getElementById('select_cinema'),
    select_time = document.getElementById('select_time'),
    select_time_clicked_showDate = '',
    select_time_clicked_cinemaId = '',
    select_time_clicked_cinema_name = '';

  /*电影信息部分开始*/
  // 获取电影信息
  function get_movie_info() {
    return new Promise((resolve, reject) => {
      $.get(global_api.movie_info + movieId, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 将电影各信息呈现在页面上
  function show_movie_info(movie_info) {
    global_movie_info.length = movie_info.length;
    global_movie_info.movieType = movie_info.movieType;
    let movie_info_poster = document.getElementById('movie_info_poster'),
      movie_info_title = document.getElementById('movie_info_title'),
      movie_info_rating = document.getElementById('movie_info_rating'),
      movie_info_pubdate = document.getElementById('movie_info_pubdate'),
      movie_info_movie_style = document.getElementById('movie_info_movie_style'),
      movie_info_movie_type = document.getElementById('movie_info_movie_type'),
      movie_info_country = document.getElementById('movie_info_country'),
      movie_info_length = document.getElementById('movie_info_length');
    movie_info_poster.src = movie_info.posterSmall;
    movie_info_title.innerHTML = movie_info.title;
    movie_info_rating.innerHTML = movie_info.rating;
    movie_info_pubdate.innerHTML = `首映：${movie_info.pubDate}`;
    let movie_info_movie_style_tmp = '';
    for (let i = 0; i < movie_info.movieStyle.length; i++) {
      movie_info_movie_style_tmp += movie_info.movieStyle[i];
      if (i != movie_info.movieStyle.length - 1) {
        movie_info_movie_style_tmp += ' / ';
      }
    }
    movie_info_movie_style.innerHTML = `类型：${movie_info_movie_style_tmp}`;
    movie_info_movie_type.innerHTML = `版本：${movie_info.movieType}`;
    movie_info_country.innerHTML = `地区：${movie_info.country}`;
    movie_info_length.innerHTML = `时长：${movie_info.length}分钟`;
  }

  async function movie_info_part() {
    // 获取电影信息
    let movie_info = await get_movie_info();
    // 将电影各信息呈现在页面上
    show_movie_info(movie_info);
  }

  movie_info_part();
  /*电影信息部分结束*/

  /*选择部分 开始*/
  // 获取电影排期
  function get_recent() {
    return new Promise((resolve, reject) => {
      $.get(global_api.recent, {movieId: movieId}, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取电影院日排期摘要
  function get_brief(showDate, cinemaId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.brief, {showDate: showDate, cinemaId: cinemaId, movieId: movieId}, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取影院信息
  function get_cinema(cinemaId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.cinema + cinemaId, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取电影院日排期
  function get_day(select_time_clicked_showDate, select_time_clicked_cinemaId) {
    return new Promise((resolve, reject) => {
      $.get(global_api.day, {showDate: select_time_clicked_showDate, cinemaId: select_time_clicked_cinemaId, movieId: movieId}, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取电影排期（根据日排期）
  function get_day_times(day, i) {
    return new Promise((resolve, reject) => {
      $.get(global_api.day_times + day.data[i], function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 获取影厅信息（不含座位布局）
  function get_cinema_hall(day_times) {
    return new Promise((resolve, reject) => {
      $.get(global_api.cinema_hall + day_times.cinemaHallId, function(data, textStatus) {
        resolve(data);
      });
    })
  }

  // 将某个排期对应的影院各信息呈现在页面上
  function show_cinema(i, cinemaId, brief, cinema) {
    let select_cinema_fragment = document.createDocumentFragment();
    let select_cinema_item = document.createElement('div');
    select_cinema_item.id = `select_cinema_item${i}`;
    select_cinema_item.className = 'select_cinema_item';
    let select_cinema_item_select_time = document.createElement('button');
    select_cinema_item_select_time.id = `${select_cinema_item.id}_select_time`;
    select_cinema_item_select_time.className = `select_cinema_item_select_time select_cinema_item_select_time_${cinemaId}`;
    select_cinema_item_select_time.innerHTML = '选择场次';
    let select_cinema_item_min_price = document.createElement('div');
    select_cinema_item_min_price.className = 'select_cinema_item_min_price';
    select_cinema_item_min_price.innerHTML = `￥${brief.minPrice}`;
    let select_cinema_item_min_price_span = document.createElement('span');
    select_cinema_item_min_price_span.innerHTML = '起';
    let select_cinema_item_name = document.createElement('div');
    select_cinema_item_name.className = 'select_cinema_item_name';
    select_cinema_item_name.innerHTML = cinema.cinemaName;
    let select_cinema_item_location = document.createElement('div');
    select_cinema_item_location.className = 'select_cinema_item_location';
    select_cinema_item_location.innerHTML = cinema.cinemaAddr;
    select_cinema_item.appendChild(select_cinema_item_select_time);
    select_cinema_item_min_price.appendChild(select_cinema_item_min_price_span);
    select_cinema_item.appendChild(select_cinema_item_min_price);
    select_cinema_item.appendChild(select_cinema_item_name);
    select_cinema_item.appendChild(select_cinema_item_location);
    for (let j = 0; j < brief.showTime.length; j++) {
      let select_cinema_item_time = document.createElement('div');
      select_cinema_item_time.className = 'select_cinema_item_time';
      select_cinema_item_time.innerHTML = brief.showTime[j].slice(0,5);
      select_cinema_item.appendChild(select_cinema_item_time);
    }
    select_cinema_fragment.appendChild(select_cinema_item);
    select_cinema.appendChild(select_cinema_fragment);
  }

  // 移除所有影院信息
  function select_cinema_remove_items() {
    let lengthTmp = select_cinema.childNodes.length;
    for (let i = 1; i < lengthTmp; i++) {
      select_cinema.removeChild(select_cinema.childNodes[1]);
    }
  }

  // 移除所有选择场次信息
  function select_time_remove_items() {
    let lengthTmp = select_time.childNodes.length;
    for (let i = 0; i < lengthTmp; i++) {
      select_time.removeChild(select_time.childNodes[0]);
    }
  }

  // 将影院名，更改影院按钮等插入DOM中
  function show_name_and_button(select_time_clicked_cinema_name) {
    let select_time_cinema_info = document.createElement('div');
    select_time_cinema_info.id = 'select_time_cinema_info';
    let select_time_change_cinema = document.createElement('button');
    select_time_change_cinema.id = 'select_time_change_cinema';
    select_time_change_cinema.innerHTML = '更改影院';
    let select_time_cinema_name = document.createElement('div');
    select_time_cinema_name.id = 'select_time_cinema_name';
    select_time_cinema_name.innerHTML = select_time_clicked_cinema_name;
    select_time_cinema_info.appendChild(select_time_change_cinema);
    select_time_cinema_info.appendChild(select_time_cinema_name);
    select_time.appendChild(select_time_cinema_info);
    let select_time_title = document.createElement('div')
    select_time_title.id = 'select_time_title';
    select_time_title.innerHTML = '选择场次';
    select_time.appendChild(select_time_title);
  }

  // 将场次进行排序
  function sort_select_time_items() {
    let lengthTmp = select_time.childNodes.length,
      objTmp = {};
    for (let i = 2; i < lengthTmp; i++) {
      objTmp[select_time.childNodes[i].childNodes[0].innerHTML.split(':')[0] + select_time.childNodes[i].childNodes[0].innerHTML.split(':')[1] + i] = select_time.childNodes[i].id;
    }
    let arrTmp = Object.keys(objTmp);
    for (let i = 2; i < lengthTmp; i++) {
      for (let j = 2; j < lengthTmp - 1; j++) {
        if (select_time.childNodes[j].id == objTmp[arrTmp[i - 2]]) {
          select_time.appendChild(select_time.childNodes[j]);
          break;
        }
      }
    }
  }

  // 选择场次部分
  async function select_time_part(select_time_clicked_showDate, select_time_clicked_cinemaId, select_time_clicked_cinema_name) {
    select_time_remove_items();
    // 将影院名，更改影院按钮等插入DOM中
    show_name_and_button(select_time_clicked_cinema_name);
    // 获取电影院日排期
    let day = await get_day(select_time_clicked_showDate, select_time_clicked_cinemaId);
    if (day.count == 0) {
      show_day_times_item_empty_hint();
    }
    for (let i = 0; i < day.count; i++) {
      // 获取电影排期（根据日排期）
      let day_times = await get_day_times(day, i);
      // 获取影厅信息（不含座位布局）
      let cinema_hall = await get_cinema_hall(day_times);
      // 将某场次的各信息呈现到页面上
      show_day_times_item(day, i, day_times, cinema_hall);
    }
    // 选择场次部分的两个点击事件
    select_time.onclick = function(event) {
      if (event.target.id == 'select_time_change_cinema') {
        window.location.hash = '#select_cinema';
      }
      if (event.target.id.slice(18, 29) == 'select_seat') {
        let arrTmp = event.target.id.split('_'),
          cinemaHallIdTmp = arrTmp[5],
          movieOnShowIdTmp = arrTmp[6],
          showTimeTmp = arrTmp[7];
        window.location = `./select_seat.html?cinemaHallId=${cinemaHallIdTmp}&movieOnShowId=${movieOnShowIdTmp}&movieId=${movieId}&showDate=${select_time_clicked_showDate}&showTime=${showTimeTmp}`;
      }
    }
  }

  // 将电影各个排期呈现在页面上
  function show_recent(recent) {
    let select_date = document.getElementById('select_date'),
      select_date_fragment = document.createDocumentFragment();
    for (let i = 1; i <= recent.count; i++) {
      let button = document.createElement('button');
      button.id = `select_date_button${i}`;
      if (i == 1) {
        button.className += 'active';
      }
      let monthTmp = recent.data[i - 1].showDate.slice(5,7);
      if (monthTmp.slice(0, 1) == '0') {
        monthTmp = monthTmp.slice(1, 2);
      }
      let dayTmp = recent.data[i - 1].showDate.slice(8,10);
      if (dayTmp.slice(0, 1) == '0') {
        dayTmp = dayTmp.slice(1, 2);
      }
      button.innerHTML = `${monthTmp}月${dayTmp}日`;
      select_date_fragment.appendChild(button);
    }
    select_date.appendChild(select_date_fragment);
  }

  // 将当日所有排期各信息呈现在页面上
  async function show_all_day_times(recent) {
    // 初始化一些变量
    let select_cinema_count = recent.data[select_date_initial_count - 1].cinemaId.length,
      cinemaHallId = '',
      movieOnShowId = '',
      showTime = '';
    const showDate = recent.data[select_date_initial_count - 1].showDate;

    // 将该日期下的各排期呈现在页面上
    for (let i = 1; i <= select_cinema_count; i++) {
      const cinemaId = recent.data[select_date_initial_count - 1].cinemaId[i - 1];
      // 获取电影院日排期摘要
      let brief = await get_brief(showDate, cinemaId);
      // 获取影院信息
      let cinema = await get_cinema(cinemaId);
      // 将某个排期对应的影院各信息呈现在页面上
      show_cinema(i, cinemaId, brief, cinema);
    }

    // 点击选择场次按钮进行选择影院和选择场次的切换
    select_cinema.onclick = function(event) {
      if (event.target.id.slice(-11) == 'select_time') {
        window.location.hash = '#select_time';
        select_date_initial_count_tmp = select_date_initial_count;
        select_time_clicked_showDate = showDate;
        select_time_clicked_cinemaId = event.target.className.split('_')[event.target.className.split('_').length - 1];
        select_time_clicked_cinema_name = event.target.nextSibling.nextSibling.innerHTML;
        select_time_part(showDate, select_time_clicked_cinemaId, select_time_clicked_cinema_name);
        // 更改日期 部分
        select_date_part(recent, select_time_clicked_cinemaId, select_time_clicked_cinema_name);
      }
    }
    // 更改日期 部分
    select_date_part(recent, select_time_clicked_cinemaId, select_time_clicked_cinema_name);
  }

  function show_day_times_item_empty_hint() {
    let select_time_item_fragment = document.createDocumentFragment();
    let select_time_item = document.createElement('div');
    select_time_item.className += 'select_time_item';
    select_time_item.innerHTML = '无对应场次';
    select_time.appendChild(select_time_item);
  }

  // 将某场次的各信息呈现到页面上
  function show_day_times_item(day, i, day_times, cinema_hall) {
    let select_time_item_fragment = document.createDocumentFragment();
    let select_time_item = document.createElement('div');
    select_time_item.id = `select_time_item${i + 1}`;
    select_time_item.className += 'select_time_item';

    let select_time_item_show_time = document.createElement('div');
    select_time_item_show_time.className = 'select_time_item_show_time';
    select_time_item_show_time.innerHTML = day_times.showTime.slice(0, 5);
    let select_time_item_end_time = document.createElement('div');
    select_time_item_end_time.className = 'select_time_item_end_time';
    let minutes_tmp = day_times.showTime.split(':')[1],
      hours_tmp = day_times.showTime.split(':')[0];
    hours_tmp = parseInt(hours_tmp);
    minutes_tmp = parseInt(minutes_tmp);
    hours_tmp += Math.floor((minutes_tmp + global_movie_info.length) / 60);
    minutes_tmp = (minutes_tmp + global_movie_info.length) % 60;
    if (hours_tmp < 10 && hours_tmp >= 0) {
      hours_tmp = '0' + hours_tmp.toString();
    } else if (hours_tmp >= 24) {
      hours_tmp = '0' + (hours_tmp - 24).toString();
    }
    if (minutes_tmp < 10 && minutes_tmp >= 0) {
      minutes_tmp = '0' + minutes_tmp.toString();
    }
    select_time_item_end_time.innerHTML = '- ' + hours_tmp + ':' + minutes_tmp;
    let select_time_item_lang_and_movie_type = document.createElement('div');
    select_time_item_lang_and_movie_type.className = 'select_time_item_lang_and_movie_type';
    select_time_item_lang_and_movie_type.innerHTML = `${day_times.lang} ${global_movie_info.movieType}`;
    let select_time_item_cinema_hall_name = document.createElement('div');
    select_time_item_cinema_hall_name.className = 'select_time_item_cinema_hall_name';
    select_time_item_cinema_hall_name.innerHTML = cinema_hall.hallName;
    let select_time_item_price = document.createElement('div');
    select_time_item_price.className = 'select_time_item_price';
    select_time_item_price.innerHTML = `￥${day_times.price}`;
    let select_time_item_select_seat = document.createElement('button');
    select_time_item_select_seat.className = 'select_time_item_select_seat';
    select_time_item_select_seat.id = `select_time_item${i + 1}_select_seat_${day_times.cinemaHallId}_${day_times.movieOnShowId}_${day_times.showTime}`;
    select_time_item_select_seat.innerHTML = '选座购票';

    select_time_item_fragment.appendChild(select_time_item_show_time);
    select_time_item_fragment.appendChild(select_time_item_end_time);
    select_time_item_fragment.appendChild(select_time_item_lang_and_movie_type);
    select_time_item_fragment.appendChild(select_time_item_cinema_hall_name);
    select_time_item_fragment.appendChild(select_time_item_price);
    select_time_item_fragment.appendChild(select_time_item_select_seat);
    select_time_item.appendChild(select_time_item_fragment);
    select_time.appendChild(select_time_item);
    if (select_time.childNodes.length == day.count + 2) {
      sort_select_time_items();
    }
  }

  // 更改日期 部分
  function select_date_part(recent, select_time_clicked_cinemaId, select_time_clicked_cinema_name) {
    let select_date_documents = {};
    for (let i = 1; i <= recent.count; i++) {
      select_date_documents[`select_date_button${i}`] = document.getElementById(`select_date_button${i}`);
    }
    select_date.onclick = function(event) {
      if (event.target.id.slice(event.target.id.length - 1) != select_date_initial_count && event.target.id.slice(0, event.target.id.length - 1) == 'select_date_button') {
        if (location.hash == '#select_cinema') {
          select_date_documents[`select_date_button${select_date_initial_count}`].className = '';
          select_date_initial_count = event.target.id.slice(-1);
          select_date_documents[`select_date_button${select_date_initial_count}`].className += 'active';
          select_cinema_remove_items();
          show_all_day_times(recent);
        } else if (location.hash == '#select_time') {
          select_date_documents[`select_date_button${select_date_initial_count}`].className = '';
          select_date_initial_count = event.target.id.slice(-1);
          select_date_documents[`select_date_button${select_date_initial_count}`].className += 'active';
          select_time_part(recent.data[select_date_initial_count - 1].showDate, select_time_clicked_cinemaId, select_time_clicked_cinema_name);
        }
      }
    }
  }

  async function selectPart() {
    // 获取电影排期
    let recent = await get_recent();
    // 将电影各个排期日期呈现在页面上
    show_recent(recent);
    // 将当日所有排期各信息呈现在页面上
    show_all_day_times(recent);

    // 进行页面的url hash监控，有变化时就进行选择影院和选择场次的切换
    window.onhashchange = function(hashObj) {
      let hashTmp = window.location.hash;
      if (hashTmp == '#select_cinema') {
        document.getElementById('select_time').style.display = 'none';
        document.getElementById('select_cinema').style.display = 'block';
        if (select_date_initial_count != select_date_initial_count_tmp) {
          // 如果在选择场次页面下对日期进行了修改，再回到选择影院页面时，就要重新拿对应日期的影院信息
          select_cinema_remove_items();
          show_all_day_times(recent);
          select_date_initial_count_tmp = select_date_initial_count;
        }
      } else if(hashTmp == '#select_time') {
        document.getElementById('select_cinema').style.display = 'none';
        document.getElementById('select_time').style.display = 'block';
      }
    }
  }
  selectPart();

})
