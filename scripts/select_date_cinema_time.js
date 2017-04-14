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

})