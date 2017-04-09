$(document).ready(function() {
  // 注意事项！
  // 因为各部分代码处于同一个js文件里，因此尽量都创建局部变量，非不得已时避免创建全局变量，这样代码性能也更好
  // 在创建变量或函数时需要加上自己部分的前缀名: head、on_show、coming_soon
  // 例： var head_count = 0; const on_show_name = 'movie'; function coming_soon_find_movie() {}

  const build_api = {
    head: 'http://192.168.199.105/resource/movie/popular?count=3',
    on_show: 'http://192.168.199.105/resource/movie/on_show',
    coming_soon: 'http://192.168.199.105/resource/movie/coming_soon',
  }

  const global_api = {
    head: 'http://120.25.76.106/resource/movie/popular?count=3',
    on_show: 'http://120.25.76.106/resource/movie/on_show',
    coming_soon: 'http://120.25.76.106/resource/movie/coming_soon',
  }
  /*顶部电影热图 js代码部分开始*/
  let head_popular_images = $('.head_popular_movies_img');
  
  /*模拟api动态添加图片*/
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

  for (let i = 0; i < 3; i++) {
    head_popular_images[i].src = head_popular_movies_properties.data[i].uri;
  }
  /*模拟api动态添加图片*/

  /*使用ajax根据api来拿照片信息*/
  // $.get(build_api.head, function(data, textStatus) {
  //   for (let i = 0; i < 3; i++) {
  //     head_popular_images[i].src = data.data[i].uri;
  //   }
  // })
  /*使用ajax根据api来拿照片信息*/
  /*顶部电影热图 js代码部分结束*/

  /*正在热映 js代码部分开始*/

  /*使用ajax根据api来拿照片信息*/
  // var on_show_data;
  // $.get(build_api.on_show, function(data, textStatus) {
  //   console.log("data: ", data);
  //   on_show_data = data;
  // })
  /*使用ajax根据api来拿照片信息*/

  // 模拟api接口
  var on_show_data = {
    "count": 9,
    "data": [1, 2, 3, 4, 5, 6, 7, 8, 9]
  };
  function on_show_obj(_id) {
    this.id = _id;
    this.title = "";
    this.pubdate = "";
  };
  var on_show_set = new Array();
  for (var i = 0; i < on_show_data.count; i++)
    on_show_set.push(new on_show_obj(i+1));

  //  动态添加海报
  var pic_num = on_show_data.count;
  function slick_temp(i) { 
      return "<div>"+
        "<div class=\"on_show_hover\" class=\"image\">"+
          "<span>text</br><button>goto buy</button></span>"+
          "<img class=\"on_show_img\" data-lazy=\"\" ult=\"123\" >"+
        "</div>"+
      "</div>";
    };
  var on_show_html = "";
  for(var i = 0; i < pic_num; i++)
    on_show_html += slick_temp(i+1);
  $(".on_show").html(on_show_html);

  //  动态修改海报地址
  var on_show_location = "/static/pictures/resource/poster/on_show/";
  var i = 0;
  $(".on_show_img").each(function(){
    $(this).attr("data-lazy", on_show_location + "hot" + on_show_set[i].id + ".jpg");
    i++;
  });
  $(".on_show_hover").each(function() {
    $(this).bind("mouseover", function() {
      $(this).find("span").css("display", "block").css("z-index", 9);
      $(this).find("img").css("opacity", "0.4");
    });
    $(this).bind("mouseout", function() {
      $(this).find("span").css("display", "none").css("z-index", 0);
      $(this).find("img").css("opacity", "1");
    });
  });
  /*正在热映 js代码部分结束*/

  /*即将上映 js代码部分开始*/

  /*使用ajax根据api来拿照片信息*/
  // var coming_soon_data;
  // $.get(build_api.coming_soon, function(data, textStatus) {
  //   console.log("data: ", data);
  //   coming_soon_data = data;
  // })
  /*使用ajax根据api来拿照片信息*/  

  // 模拟api接口
  var coming_soon_data = {
    "count": 9,
    "data": [1, 2, 3, 4, 5, 6, 7, 8, 9]
  };
  var coming_soon_pic = [
    "p1596755313",
    "p2256580955",
    "p2441815392",
    "p2443765210",
    "p2445601403",
    "p2446525065",
    "p2448692606",
    "p2450444730",
    "p2450800270"
  ]
  function coming_soon_obj(_id) {
    this.id = _id;
    this.title = "";
    this.pubdate = "";
  };
  var coming_soon_set = new Array();
  for (var i = 0; i < coming_soon_data.count; i++)
    coming_soon_set.push(new coming_soon_obj(i+1));

  //  动态添加海报
  var coming_soon_pic_num = coming_soon_data.count;
  function coming_soon_slick_temp(i) { 
      return "<div>"+
        "<div class=\"coming_soon_hover\" class=\"image\">"+
          "<span>text</br><button>goto buy</button></span>"+
          "<img class=\"coming_soon_img\" data-lazy=\"\" ult=\"123\" >"+
        "</div>"+
      "</div>";
    };
  var coming_soon_html = "";
  for(var i = 0; i < coming_soon_pic_num; i++)
    coming_soon_html += coming_soon_slick_temp(i+1);
  $(".coming_soon").html(coming_soon_html);

//  动态修改海报地址
  var coming_soon_location = "/static/pictures/resource/poster/coming_soon/";
  var i = 0;
  $(".coming_soon_img").each(function(){
    $(this).attr("data-lazy", coming_soon_location + coming_soon_pic[i] + ".jpg");
    i++;
  });
  $(".coming_soon_hover").each(function() {
    $(this).bind("mouseover", function() {
      $(this).find("span").css("display", "block").css("z-index", 9);
      $(this).find("img").css("opacity", "0.4");
    });
    $(this).bind("mouseout", function() {
      $(this).find("span").css("display", "none").css("z-index", 0);
      $(this).find("img").css("opacity", "1");
    });
  });

  
  /*即将上映 js代码部分结束*/

  //  滑动组件
  $('.lazy').slick({
    lazyLoad: 'ondemand',
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite:false
  });

});