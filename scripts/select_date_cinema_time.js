$(document).ready(function() {
  const global_api = {
    movie_info: 'http://120.25.76.106/resource/movie/'
  }

  /*模拟数据*/
  const movie_id = 1;

  const movie_info = {
    "id": 1,
    "title": "美女与野兽",
    "pubdate": "2017-03-17",
    "length": 130,
    "rating": 8.2,
    "country": "美国",
    "movieStatus": "on",
    "movieType": "3D",
    "movieStyle": ["爱情", "奇幻", "歌舞"],
    "posterSmall": "http://123.123.123.123/AAA.png",
    "posterLarge": "http://123.123.123.123/BBB.png"
  }

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

  $.get(global_api.movie_info + movie_id, function(data, textStatus) {
    console.log('textStatus: ', textStatus);
    console.log('data: ', data);
  })


})