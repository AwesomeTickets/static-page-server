$(document).ready(function() {
  // 注意事项！
  // 因为各部分代码处于同一个js文件里，因此尽量都创建局部变量，非不得已时避免创建全局变量，这样代码性能也更好
  // 在创建变量或函数时需要加上自己部分的前缀名: head、on_show、coming_soon
  // 例： var head_count = 0; const on_show_name = 'movie'; function coming_soon_find_movie() {}

  /*顶部电影热图 js代码部分开始*/
  const head_popular_movies_properties = {
    "count": 3,
    "subjects": [
        {
            "id": 154685,
            "posterURL": "/static/pictures/resource/banner/1.png"
        },
        {
            "id": 164597,
            "posterURL": "/static/pictures/resource/banner/2.png"
        },
        {
            "id": 197682,
            "posterURL": "/static/pictures/resource/banner/3.png"
        },
    ],
  }

  let head_popular_images = document.getElementById('head_popular_images');
  /*顶部电影热图 js代码部分结束*/

  /*正在热映 js代码部分开始*/
  // 你的代码

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
          "<span>123</br><button>goto buy</button></span>"+
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
    $(this).bind("mouseover", function(i) {
      $(this).find("span").css("display", "block").css("z-index", 9);
      $(this).find("img").css("opacity", "0.4");
    });
    $(this).bind("mouseout", function(i) {
      $(this).find("span").css("display", "none").css("z-index", 0);
      $(this).find("img").css("opacity", "1");
    });
    i++;
  });


  //  滑动组件
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