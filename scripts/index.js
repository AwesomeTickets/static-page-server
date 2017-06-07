import "babel-polyfill";

$(document).ready(function() {
  // 注意事项！
  // 因为各部分代码处于同一个js文件里，因此尽量都创建局部变量，非不得已时避免创建全局变量，这样代码性能也更好
  // 在创建变量或函数时需要加上自己部分的前缀名: head、on_show、coming_soon
  // 例： var head_count = 0; const on_show_name = 'movie'; function coming_soon_find_movie() {}
  // const global_url = 'http://120.25.76.106';
  const global_api = {
    head: `${global_url}/resource/movie/popular?count=3`,
    on_show: `${global_url}/resource/movie/on`,
    movie_info: `${global_url}/resource/movie/`,
    coming_soon: `${global_url}/resource/movie/soon`,
  }

  /*顶部电影热图 js代码部分开始*/
  let head_popular_images = $('.head_popular_movies_img');

  /*使用ajax根据api来拿照片信息*/
  $.get(global_api.head, function(data, textStatus) {
    for (let i = 0; i < 3; i++) {
      head_popular_images[i].src = data.data[i].posterLarge;
    }
  })
  /*顶部电影热图 js代码部分结束*/

  /*正在热映 js代码部分开始*/
  var global_flag = 0;
  // get resourse and handle
  $.get(global_api.on_show, function(data, textStatus) {
    //  动态添加海报
    $(".on_show_num").html(data.count+"部");
    on_show_add_img(data.count);

    var on_show_global_temp = 0, on_show_num = data.count;
    for (var i = 0; i < data.count; i++) {
      $.get(global_api.movie_info+data.data[i], function(data, textStatus) {
        $("#on_show_img"+on_show_global_temp).attr("data-lazy", data.posterSmall);
        on_show_set_info(data, on_show_global_temp);
        on_show_set_hover_info(data, on_show_global_temp);
        on_show_global_temp++;
        if (on_show_global_temp == on_show_num) {
          if (global_flag == 1) {
            slick_func();
          } else {
            global_flag++;
          }
        }
        $("#on_show_button"+ (on_show_global_temp - 1)).addClass('on_show_img_class_' + data.movieId);
      });
    }

    // 添加点击事件，点击进入选择日期、影院、场次页面。
    const on_show_content = $('.content')[0];
    on_show_content.addEventListener('click', function(event) {
      if (event.target.id.slice(0, event.target.id.length - 1) == 'on_show_button') {
        const movieId = event.target.className.split('_')[4];
        window.location = './layouts/select_date_cinema_time.html?movieId=' + movieId + '#select_cinema';
      }
    });
  });

  function on_show_set_info(data, i) {
    var temp = data.title.substring(0, 6);
    if (data.title.substring(6, 7) != "") {temp += "...";}
    $("#on_show_poster_hint_name"+i).html(temp);
    $("#on_show_poster_hint_score"+i).html(parseFloat(data.rating).toFixed(1));
  }

  function on_show_set_hover_info(data, i) {
    var temp = data.title.substring(0, 6);
    if (data.title.substring(6, 7) != "") {temp += "...";}
    var on_show_temp = $("#on_show_hover_info"+i);
    on_show_temp.find(".on_show_hover_title").html(temp);
    on_show_temp.find(".on_show_hover_rating").html(parseFloat(data.rating).toFixed(1));
    on_show_temp.find(".on_show_hover_type").html(data.movieType);
    var string = "";
    for (var i = 0; i < data.movieStyle.length; i++)
      string = string + data.movieStyle[i] + (i == data.movieStyle.length-1 ? "" : "&nbsp;/&nbsp;");
    on_show_temp.find(".on_show_hover_style").html(string);
    on_show_temp.find(".on_show_hover_CAndL").html(data.country + "&nbsp;/&nbsp;" +data.length +"分钟");
    on_show_temp.find(".on_show_hover_pubdate").html(data.pubDate+"&nbsp;上映");
  }
function slick_temp(i) {
      return "<div>"+
        "<div class=\"on_show_hover\" class=\"image\">"+
          "<div class=\"on_show_poster_hint\">"+
            "<div id=\"on_show_poster_hint_name"+i+"\" class=\"on_show_movie_name\">"+"</div>"+
            "<div id=\"on_show_poster_hint_score"+i+"\" class=\"on_show_movie_score\">"+"</div>"+
          "</div>"+
          "<div class=\"on_show_hover_fore\"></div>"+
          "<img id=\"on_show_img"+i+"\" data-lazy=\"\" ult=\"123\" >"+
          "<div id=\"on_show_hover_info"+i+"\" class=\"on_show_hover_info\">"+
            "<div class=\"on_show_hover_title\"></div>"+
            "<div class=\"on_show_hover_rating\"></div>"+
            "<div class=\"on_show_hover_type\"></div>"+
            "<div class=\"on_show_hover_style\"></div>"+
            "<div class=\"on_show_hover_CAndL\"></div>"+
            "<div class=\"on_show_hover_pubdate\"></div>"+
            "<button id=\"on_show_button"+i+"\">购票</button>"+
          "</div>"+
        "</div>"+
      "</div>";
    }
  function on_show_add_img(count) {
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
         $(this).find(".on_show_hover_fore").css("display", "block");
         $(this).find(".on_show_poster_hint").css("display", "none");
       });
       $(this).bind("mouseout", function() {
         $(this).find(".on_show_hover_info").css("display", "none").css("z-index", 0);
         $(this).find(".on_show_hover_fore").css("display", "none");
         $(this).find(".on_show_poster_hint").css("display", "block");
       });
     });
   }
  /*正在热映 js代码部分结束*/


  /*即将上映 js代码部分开始*/
  // 获取海报数据
  $.get(global_api.coming_soon, function(data, textStatus) {
    if (textStatus != "success")alert("服务器雪崩");
    $(".coming_soon_num").html(data.count+"部");
    coming_soon_add_img(data.count);

    var coming_soon_global_temp = 0, coming_soon_num = data.count;
    for(var i = 0; i < data.count; i++) {
      $.get(global_api.movie_info+data.data[i], function(data, textStatus) {
        coming_soon_set_poster_resource(data.posterSmall, coming_soon_global_temp);
        coming_soon_set_info(data, coming_soon_global_temp);
        coming_soon_set_hover_info(data, coming_soon_global_temp);
        coming_soon_global_temp++;
        if (coming_soon_global_temp == coming_soon_num) {
          if (global_flag == 1){slick_func();}
          else global_flag++;
        }
      });
    }
    coming_soon_set_hover();
  });

  function coming_soon_add_img(coming_soon_poster_num) {
    var coming_soon_html = "";
    for(var i = 0; i < coming_soon_poster_num; i++)
      coming_soon_html += coming_soon_slick_temp(i);
    $(".coming_soon").html(coming_soon_html);
  }

  function coming_soon_slick_temp(i) {
      return "<div>"+
        "<div class=\"coming_soon_hover\" class=\"image\">"+
          "<div class=\"coming_soon_poster_hint\">"+
            "<div id=\"coming_soon_poster_hint_name"+i+"\" class=\"coming_soon_movie_name\">"+"</div>"+
          "</div>"+
          "<div class=\"coming_soon_hover_fore\"></div>"+
          "<img id=\"coming_soon_img"+i+"\" data-lazy=\"\" ult=\"123\" >"+
          "<div id=\"coming_soon_hover_info"+i+"\" class=\"coming_soon_hover_info\">"+
            "<div class=\"coming_soon_hover_title\"></div>"+
            "<div class=\"coming_soon_hover_type\"></div>"+
            "<div class=\"coming_soon_hover_style\"></div>"+
            "<div class=\"coming_soon_hover_CAndL\"></div>"+
            "<div class=\"coming_soon_hover_pubdate\"></div>"+
            "<button>预售</button>"+
          "</div>"+
        "</div>"+
      "</div>";
    }

    function coming_soon_set_poster_resource(resource, i) {
      $("#coming_soon_img"+i).attr("data-lazy", resource);
    }

    function coming_soon_set_info(data, i) {
      var temp = data.title.substring(0, 6);
      if (data.title.substring(6, 7) != "") { temp += "..."; }
      $("#coming_soon_poster_hint_name"+i).html(temp);
    }

    function coming_soon_set_hover_info(data, i) {
      var temp = data.title.substring(0, 6);
      if (data.title.substring(6, 7) != "") {temp += "...";}
      var coming_soon_temp = $("#coming_soon_hover_info"+i);
      coming_soon_temp.find(".coming_soon_hover_title").html(temp);
      coming_soon_temp.find(".coming_soon_hover_type").html(data.movieType);
      var string = "";
      for (var i = 0; i < data.movieStyle.length; i++)
        string = string + data.movieStyle[i] + (i == data.movieStyle.length-1 ? "" : "&nbsp;/&nbsp;");
      coming_soon_temp.find(".coming_soon_hover_style").html(string);
      coming_soon_temp.find(".coming_soon_hover_CAndL").html(data.country + "&nbsp;/&nbsp;" +data.length +"分钟");
      coming_soon_temp.find(".coming_soon_hover_pubdate").html(data.pubDate+"&nbsp;上映");
    }

    function coming_soon_set_hover() {
      $(".coming_soon_hover").each(function() {
        $(this).bind("mouseover", function() {
          $(this).find(".coming_soon_hover_info").css("display", "block").css("z-index", 9);
          $(this).find(".coming_soon_hover_fore").css("display", "block");
          $(this).find(".coming_soon_poster_hint").css("display", "none");
        });
        $(this).bind("mouseout", function() {
          $(this).find(".coming_soon_hover_info").css("display", "none").css("z-index", 0);
          $(this).find(".coming_soon_hover_fore").css("display", "none");
          $(this).find(".coming_soon_poster_hint").css("display", "block");
        });
      });
    }
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
