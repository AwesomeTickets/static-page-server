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
            "cinemaID": [111, 222, 333]
        },
        {
            "date": "2017-04-05",
            "cinemaID": [444, 555, 666]
        }
    ]
  }
  /*模拟数据*/

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
  for (let i = 1; i < recent.count + 1; i++) {
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

  // 找到每个button
  let select_date_documents = {};
  for (let i = 1; i < recent.count + 1; i++) {
    select_date_documents['select_date_button' + i] = document.getElementById('select_date_button' + i);
  }

  let select_date_initial_count = 1;
  select_date.onclick = function(event) {
    if (event.target.id.slice(-1) != select_date_initial_count) {
      select_date_documents['select_date_button' + select_date_initial_count].className = '';
      select_date_initial_count = event.target.id.slice(-1);
      select_date_documents['select_date_button' + select_date_initial_count].className += 'active';
    }
  }
  /*选择日期部分结束*/

  // window.onhashchange = function(hashObj) {
  //   console.log('hashObj: ', hashObj);
  //   let newhash = hashObj.newURL.split('#')[1],
  //     oldhash = hashObj.oldURL.split('#')[1];
  //   document.getElementById(oldhash).style.display = 'none';
  //   document.getElementById(newhash).style.display = 'block';
  // }

  // setTimeout(function() {
  //   window.location.hash = 'B'
  // }, 4000);
  // setTimeout(function() {
  //   window.location.hash = 'C'
  // }, 8000);
})