$(document).ready(function() {
  // 注意事项！
  // 因为各部分代码处于同一个js文件里，因此尽量都创建局部变量，非不得已时避免创建全局变量，这样代码性能也更好
  // 在创建变量或函数时需要加上自己部分的前缀名: head、on_show、coming_soon
  // 例： var head_count = 0; const on_show_name = 'movie'; function coming_soon_find_movie() {}

  /*顶部电影热图 js代码部分开始*/
  const head_popular_movies = {
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

  let head_popular_images = document.getElementById("head_popular_images"),
    head_change_count = 1;

  console.log(head_popular_images.clientWidth);
  console.log(head_popular_images.style);
  head_popular_images.addEventListener('animationend', function() {
    head_popular_images.style.backgroundImage = 'url(' + head_popular_movies.subjects[1].posterURL + '),url(' + head_popular_movies.subjects[2].posterURL + ')';
    console.log(head_popular_images.style.backgroundImage);    
  })
  // 每隔四秒一次变化
  setTimeout(function head_change_popular_images() {

    head_change_count++;
    if (head_change_count == 3) {
      head_change_count = 0;
    }
    // setTimeout(head_change_popular_images, 4000, head_change_count, head_popular_movies);
  }, 4000, head_change_count, head_popular_movies)
  /*顶部电影热图 js代码部分结束*/

  /*正在热映 js代码部分开始*/
  // 你的代码
  /*正在热映 js代码部分结束*/

  /*即将上映 js代码部分开始*/
  // 你的代码
  /*即将上映 js代码部分结束*/
});