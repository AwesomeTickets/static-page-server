$(document).ready(function() {
  const global_api = {
    movie_info: 'http://120.25.76.106/resource/movie/'
  }

  /*模拟数据*/
  const movie_id = 1;

  const recent = {
    "count": 2,
    "data": [
        {
            "date": "2017-04-04",
            "cinemaID": [111, 222, 3, 4, 5]
        },
        {
            "date": "2017-04-05",
            "cinemaID": [444, 555, 666]
        }
    ]
  }

  const cinema = {
    "cinemaID": 111,
    "name": "金逸珠江国际影城（大学城店）",
    "location": "番禺区小谷围街贝岗村中二横路1号GOGO新天地商业广场B2B001铺"
  }

  const cinema2 = {
    "cinemaID": 444,
    "name": "万达国际影城（番禺店）",
    "location": "番禺区南村镇汉溪大道东389号番禺万达广场四楼"
  }

  const brief = {
    "min_price": 38.0,
    "time": ["14:55:00", "18:20:00", "21:25:00"]
  }
  /*模拟数据*/

  window.location.hash = 'select_cinema';

  /*电影信息部分开始*/
  $.get(global_api.movie_info + movie_id, function(data, textStatus) {
    let movie_info_poster = document.getElementById('movie_info_poster'),
      movie_info_title = document.getElementById('movie_info_title'),
      movie_info_rating = document.getElementById('movie_info_rating'),
      movie_info_pubdate = document.getElementById('movie_info_pubdate'),
      movie_info_movie_style = document.getElementById('movie_info_movie_style'),
      movie_info_movie_type = document.getElementById('movie_info_movie_type'),
      movie_info_country = document.getElementById('movie_info_country'),
      movie_info_length = document.getElementById('movie_info_length');
    movie_info_poster.src = data.posterSmall;
    movie_info_title.innerHTML = data.title;
    movie_info_rating.innerHTML = data.rating;
    movie_info_pubdate.innerHTML = '首映：' + data.pubdate;
    let movie_info_movie_style_tmp = '';
    for (let i = 0; i < data.movieStyle.length; i++) {
      movie_info_movie_style_tmp += data.movieStyle[i];
      if (i != data.movieStyle.length - 1) {
        movie_info_movie_style_tmp += ' / ';
      }
    }
    movie_info_movie_style.innerHTML = '类型：' + movie_info_movie_style_tmp;
    movie_info_movie_type.innerHTML = '版本：' + data.movieType;
    movie_info_country.innerHTML = '地区：' + data.country;
    movie_info_length.innerHTML = '时长：' + data.length + '分钟';
  })
  /*电影信息部分结束*/

  /*选择日期部分开始*/

  // 根据api动态拿排期并添加到DOM中
  let select_date = document.getElementById('select_date'),
    select_date_fragment = document.createDocumentFragment();
  for (let i = 1; i <= recent.count; i++) {
    let button = document.createElement('button');
    button.id = 'select_date_button' + i;
    if (i == 1) {
      button.className += 'active';
    }
    let monthTmp = recent.data[i - 1].date.slice(5,7);
    if (monthTmp.slice(0, 1) == '0') {
      monthTmp = monthTmp.slice(1, 2);
    }
    let dayTmp = recent.data[i - 1].date.slice(8,10);
    if (dayTmp.slice(0, 1) == '0') {
      dayTmp = dayTmp.slice(1, 2);
    }
    button.innerHTML = monthTmp + '月' + dayTmp + '日';
    select_date_fragment.appendChild(button);
  }
  select_date.appendChild(select_date_fragment);
  /*选择日期部分结束*/

  let select_date_initial_count = 1,
    select = document.getElementById('select'),
    select_cinema = document.getElementById('select_cinema'),
    select_time = document.getElementById('select_time');

  /*选择影院部分开始*/
  function select_cinema_add_items() {
    let select_cinema_count = recent.data[select_date_initial_count - 1].cinemaID.length,
      select_cinema_fragment = document.createDocumentFragment();
    for (let i = 1; i <= select_cinema_count; i++) {
      let select_cinema_item = document.createElement('div');
      select_cinema_item.id = 'select_cinema_item' + i;
      select_cinema_item.className = 'select_cinema_item';
      let select_cinema_item_select_time = document.createElement('button');
      select_cinema_item_select_time.id = select_cinema_item.id + '_select_time';
      select_cinema_item_select_time.className = 'select_cinema_item_select_time';
      select_cinema_item_select_time.innerHTML = '选择场次';
      let select_cinema_item_min_price = document.createElement('div');
      select_cinema_item_min_price.className = 'select_cinema_item_min_price';
      select_cinema_item_min_price.innerHTML = '￥' + brief.min_price;
      let select_cinema_item_min_price_span = document.createElement('span');
      select_cinema_item_min_price_span.innerHTML = '起';
      let select_cinema_item_name = document.createElement('div');
      select_cinema_item_name.className = 'select_cinema_item_name';
      select_cinema_item_name.innerHTML = cinema.name;
      let select_cinema_item_location = document.createElement('div');
      select_cinema_item_location.className = 'select_cinema_item_location';
      select_cinema_item_location.innerHTML = cinema.location;
      select_cinema_item.appendChild(select_cinema_item_select_time);
      select_cinema_item_min_price.appendChild(select_cinema_item_min_price_span);
      select_cinema_item.appendChild(select_cinema_item_min_price);
      select_cinema_item.appendChild(select_cinema_item_name);
      select_cinema_item.appendChild(select_cinema_item_location);
      for (let j = 0; j < brief.time.length; j++) {
        let select_cinema_item_time = document.createElement('div');
        select_cinema_item_time.className = 'select_cinema_item_time';
        select_cinema_item_time.innerHTML = brief.time[j].slice(0,5);
        select_cinema_item.appendChild(select_cinema_item_time);
      }
      select_cinema_fragment.appendChild(select_cinema_item);
    }
    select_cinema.appendChild(select_cinema_fragment);
  }
  function select_cinema_remove_items() {
    let lengthTmp = select_cinema.childNodes.length;
    for (let i = 1; i < lengthTmp; i++) {
      select_cinema.removeChild(select_cinema.childNodes[1]);
    }
  }
  select_cinema_add_items();
  // select_cinema_remove_items();
  /*选择影院部分结束*/


  /*更改日期开始*/
  // 找到每个button
  let select_date_documents = {};
  for (let i = 1; i <= recent.count; i++) {
    select_date_documents['select_date_button' + i] = document.getElementById('select_date_button' + i);
  }

  select_date.onclick = function(event) {
    if (event.target.id.slice(-1) != select_date_initial_count && event.target.id.slice(0, event.target.id.length - 1) == 'select_date_button') {
      select_date_documents['select_date_button' + select_date_initial_count].className = '';
      select_date_initial_count = event.target.id.slice(-1);
      select_date_documents['select_date_button' + select_date_initial_count].className += 'active';
      select_cinema_remove_items();
      select_cinema_add_items();
    }
  }
  /*更改日期结束*/

  /*点击选择场次按钮进行选择影院和选择场次的切换 开始*/
  let the_select_cinema_name = '';
  select_cinema.onclick = function(event) {
    if (event.target.id.slice(-11) == 'select_time') {
      the_select_cinema_name = document.getElementById(event.target.id.slice(0, 19)).childNodes[2].innerHTML;
      window.location.hash = 'select_time';
    }

  }

  select_time.onclick = function(event) {
    if (event.target.id == 'select_time_change_cinema') {
      window.location.hash = 'select_cinema';
    }
  }
  /*点击选择场次按钮进行选择影院和选择场次的切换 结束*/

  /*进行页面的url hash监控，有变化时就进行选择影院和选择场次的切换 开始*/
  window.onhashchange = function(hashObj) {
    let newhash = hashObj.newURL.split('#')[1],
      oldhash = hashObj.oldURL.split('#')[1];
    document.getElementById(oldhash).style.display = 'none';
    document.getElementById(newhash).style.display = 'block';
  }
  /*进行页面的url hash监控，有变化时就进行选择影院和选择场次的切换 结束*/

})