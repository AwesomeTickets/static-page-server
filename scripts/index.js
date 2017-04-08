$(document).ready(function() {
  // 注意事项！
  // 因为各部分代码处于同一个js文件里，因此尽量都创建局部变量，非不得已时避免创建全局变量，这样代码性能也更好
  // 在创建变量或函数时需要加上自己部分的前缀名: head、on_show、coming_soon
  // 例： var head_count = 0; const on_show_name = 'movie'; function coming_soon_find_movie() {}

  /*顶部电影热图 js代码部分开始*/
  const head_popular_movies_properties = {
    "count":3,
    "data":[
      {
        "id":1,
        "uri":"https://raw.githubusercontent.com/AwesomeTickets/Dashboard/master/img/poster/large/1.png"
      },
      {
        "id":2,
        "uri":"https://raw.githubusercontent.com/AwesomeTickets/Dashboard/master/img/poster/large/2.png"
      },
      {
        "id":3,
        "uri":"https://raw.githubusercontent.com/AwesomeTickets/Dashboard/master/img/poster/large/3.png"
      },
    ],
  }

  let head_popular_images = $('.head_popular_movies_img');
  for (let i = 0; i < 3; i++) {
    head_popular_images[i].src = head_popular_movies_properties.data[i].uri;
  }
  // $.get('http://120.25.76.106/resource/movie/popular?count=3', function(data, textStatus) {
  //   console.log("textStatus: ", textStatus);
  //   console.log("data: ", data);
  //   for (let i = 0; i < 3; i++) {
  //     head_popular_images[i].src = data.data[i].uri;
  //   }
  // })
  /*顶部电影热图 js代码部分结束*/

  /*正在热映 js代码部分开始*/
  // 你的代码
    $('.lazy').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 6,
        slidesToScroll: 1,
        infinite:false
    });
  /*正在热映 js代码部分结束*/

  /*即将上映 js代码部分开始*/
  // 你的代码
  /*即将上映 js代码部分结束*/
});