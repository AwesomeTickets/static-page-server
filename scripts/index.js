$(document).ready(function() {
  // 注意事项！
  // 因为各部分代码处于同一个js文件里，因此尽量都创建局部变量，非不得已时避免创建全局变量，这样代码性能也更好
  // 在创建变量或函数时需要加上自己部分的前缀名: head、on_show、coming_soon
  // 例： var head_count = 0; const on_show_name = 'movie'; function coming_soon_find_movie() {}

  const global_api = {
    head: 'http://120.25.76.106/resource/movie/popular?count=3',
    on_show: 'http://120.25.76.106/resource/movie/on_show',
    coming_soon: 'http://120.25.76.106/resource/movie/coming_soon',
  }

  /*顶部电影热图 js代码部分开始*/
  let head_popular_images = $('.head_popular_movies_img');

  /*使用ajax根据api来拿照片信息*/
  $.get(global_api.head, function(data, textStatus) {
    for (let i = 0; i < 3; i++) {
      head_popular_images[i].src = data.data[i].uri;
    }
  })  
  /*顶部电影热图 js代码部分结束*/

  /*正在热映 js代码部分开始*/
  var global_flag = 0;
  // get resourse and handle
   $.get(global_api.on_show, function(data, textStatus) {
    //  动态添加海报
    on_show_add_img(data.count);

    var on_show_global_temp = 0, on_show_num = data.count;
    var on_show_resourse = "http://120.25.76.106/resource/movie/";
    for (var i = 0; i < data.count; i++) {
      $.get(on_show_resourse+data.data[i], function(data, textStatus) {
        $("#on_show_img"+on_show_global_temp).attr("data-lazy", data.posterSmall);
        on_show_set_info(data, on_show_global_temp);
        on_show_set_hover_info(data, on_show_global_temp);
        on_show_global_temp++;
        if (on_show_global_temp == on_show_num) {
          if (global_flag == 1){slick_func();}
          else global_flag++;
        }
      });
    }
  });

   function on_show_set_info(data, i) {
    var temp = data.title.substring(0, 6);
    if (data.title.substring(6, 7) != "") {temp += "...";}
    $("#on_show_poster_hint_name"+i).html(temp);
    $("#on_show_poster_hint_score"+i).html(data.rating);
   }

   function on_show_set_hover_info(data, i) {
    var temp = data.title.substring(0, 6);
    if (data.title.substring(6, 7) != "") {temp += "...";}
    var on_show_temp = $("#on_show_hover_info"+i);
    on_show_temp.find(".on_show_hover_title").html(temp);
    on_show_temp.find(".on_show_hover_rating").html(data.rating);
    on_show_temp.find(".on_show_hover_type").html(data.movieType);
    var string = "";
    for (var i = 0; i < data.movieStyle.length; i++)
      string = string + data.movieStyle[i] + "&nbsp;/&nbsp;";
    on_show_temp.find(".on_show_hover_style").html(string);
    on_show_temp.find(".on_show_hover_CAndL").html(data.country + "&nbsp;/&nbsp;" +data.length +"分钟");
    on_show_temp.find(".on_show_hover_pubdate").html(data.pubdate+"&nbsp;上映");
   }

   function on_show_add_img(count) {
    function slick_temp(i) {
      return "<div>"+
        "<div class=\"on_show_hover\" class=\"image\">"+
          "<div class=\"on_show_poster_hint\">"+
          "<div id=\"on_show_poster_hint_name"+i+"\" class=\"on_show_movie_name\">"+"</div>"+
          "<div id=\"on_show_poster_hint_score"+i+"\" class=\"on_show_movie_score\">"+"</div>"+"</div>"+
          "<img id=\"on_show_img"+i+"\" data-lazy=\"\" ult=\"123\" >"+
          "<div id=\"on_show_hover_info"+i+"\" class=\"on_show_hover_info\">"+
            "<div class=\"on_show_hover_title\"></div>"+
            "<div class=\"on_show_hover_rating\"></div>"+
            "<div class=\"on_show_hover_type\"></div>"+
            "<div class=\"on_show_hover_style\"></div>"+
            "<div class=\"on_show_hover_CAndL\"></div>"+
            "<div class=\"on_show_hover_pubdate\"></div>"+
            "<button>购票</button>"+
          "</div>"+
        "</div>"+
      "</div>";
    }
    var on_show_html = "";
    for(var i = 0; i < count; i++)
      on_show_html += slick_temp(i);
    $(".on_show").html(on_show_html);

    // 设置hover特效
    on_show_set_hover();
   }

   function on_show_set_hover() {
    $(".on_show_hover").each(function() {
      $(this).bind("mouseover", function() {
        $(this).find(".on_show_hover_info").css("display", "block").css("z-index", 9);
        $(this).find("img").css("opacity", "0.4");
        $(this).find(".on_show_poster_hint").css("display", "none");
      });
      $(this).bind("mouseout", function() {
        $(this).find(".on_show_hover_info").css("display", "none").css("z-index", 0);
        $(this).find("img").css("opacity", "1");
        $(this).find(".on_show_poster_hint").css("display", "block");
      });
    });
   }
  
  /*正在热映 js代码部分结束*/

  /*即将上映 js代码部分开始*/

  // 模拟api接口
  global_flag++;
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
  function slick_func() {
    $('.lazy').slick({
      lazyLoad: 'ondemand',
      slidesToShow: 7,
      slidesToScroll: 1,
      infinite:false
    });
  }

});