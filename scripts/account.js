import "babel-polyfill";

$(document).ready(function() {
	const table = document.getElementById("table_"),
		drop_button = document.getElementById('drop_button'),
		head_bar_count = document.getElementById('head_bar_count'),
		user_phone = document.getElementById('user_phone'),
	  phone_num = window.location.search.split('=')[1];

	const global_api = {

		// （get）可获取到购票次数，取票码，是否已取，movieOnShowId
  	get_user_history: `${global_url}/resource/user/`,

  	//（get）用movieOnShowId获取电影排期，可获取movieId，cinemaHallId，日期和时间，price
  	get_movie_info: `${global_url}/resource/movie-on-show/`,

  	// （get）用cinemaHallId获取cinemaId，几号厅
  	get_hall_info: `${global_url}/resource/cinema-hall/`,

  	// （get）用cinemaId获取电影院名
  	get_cinema_info: `${global_url}/resource/cinema/`,

  	// (get)用movieId获取电影名，小尺寸海报的URL
  	movie_info: `${global_url}/resource/movie/`,

		// 登出
		drop: `${global_url}/resource/session/drop`,
	}

	head_bar_count.style.display = 'none';
	drop_button.style.display = 'inline-block';

	var data = {
		src : '/static/pictures/assets/Account_noRecord_img.png',
		name : '金刚狼3：殊死一战1',
		time : '5月3日 20:001',
		cinema : '金逸珠江国际影城(大学城店)1 ',
		hall : '5号厅1',
		seats : '5排6座 5排7座 5排8座1',
		price : '￥98',
		state : '待取票1',
		code : '1234 5678 901'
	};

	function drop(phone_num) {
    $.ajax({
      url: global_api.drop,
      type: "POST",
      data: {
        phoneNum:phone_num,
      },
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
				window.location = '../index.html';
      },
    });
  }

	function getHistory(phone_num) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: global_api.get_user_history + phone_num + '/ticket/history',
				data: {
					phoneNum: phone_num,
				},
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					resolve(data);
				}
			})
		});
	}

	(async function init() {
		/* get history list, movieOnShowId--code, state, seats */

		// 这是动态拿数据的，count为0.
		let history = await getHistory(phone_num);

		// 这是模拟的静态数据，用这个来模拟样式
		// let history = {
	  //    "count": 2,
	  //    "data": [
	  //        {
	  //            "code": "1111111111",
	  //            "valid": true,
	  //            "seats": [[7, 8], [7, 9], [7, 10], [7, 11]],
	  //            "movieOnShowId": 111
	  //        },
	  //        {
	  //            "code": "2222222222",
	  //            "valid": false,
	  //            "seats": [[8, 8], [8, 9], [8, 10], [8, 11]],
	  //            "movieOnShowId": 222
	  //        }
	  //    ]
		//  }

		user_phone.innerHTML = `hello, ${phone_num}`;
		drop_button.onclick = function() {
			drop(phone_num);
		}
		if(history.count == 0) {
			table_.style.display = "none";
			document.getElementById("account_no_record").style.display = "block";
		} else {
			for(let i = 0; i < history.count; i++ ) {
			/* get movie information, movie_time(日期和时间), price, movieID, hallID */
			$.get(global_api.get_movie_info + history.data[i].movieOnShowId, function(movie_info) {

				/* get hall information, hall, cinemaID*/
				$.get(global_api.get_hall_info + movie_info.cinemaHallId, function(hall_info) {

					/*get cinema information, cinema*/
					$.get(global_api.get_cinema_info + hall_info.cinemaId, function(cinema_info) {

						/* get movie name, poster */
						$.get(global_api.movie_info + movie_info.movieId, function(movie_detial) {

									var time_str = movie_info.showDate.split("-");

									data.src = movie_detial.posterSmall;
									data.name = movie_detial.title;
									data.time = parseInt(time_str[1]) + "月" + parseInt(time_str[2]) + "日&nbsp;&nbsp;" + movie_info.showTime.slice(0,5);
									data.cinema = cinema_info.cinemaName;
									data.hall = hall_info.hallName;

									var seat_str = "";
									for(var j = 0; j < history.data[i].seats.length; j++) {
											seat_str = seat_str + history.data[i].seats[j][0] + "排" +
																	history.data[i].seats[j][1] + "座&nbsp;&nbsp;";
									}
									data.seats = seat_str;
									data.price = '￥' + movie_info.price;
									data.code = history.data[i].code;

									if(history.data[i].valid == false) {
										data.state = '已取票';
										var html_ = "<tbody><tr>" +
											"<td><img class=\'picture\' src=\'"+data.src+"\'/></td>"+
											"<td><div class=\'movie_name\'>"+data.name+"</div>"+
												"<div class=\'movie_time\'>"+data.time+"</div></td>"+
											"<td><div class=\'cinema_hall\'>"+data.cinema+"&nbsp"+data.hall+"</div>"+
												"<div class=\'seats\'>"+data.seats+"</div></td>"+
											"<td><div class=\'price\'>"+data.price+"</div></td>"+
											"<td><div class=\'state_over\'>"+data.state+"</div>"+
													"<div class=\'code\'>"+data.code+"</div></td>"+
											"</tr></tbody>";
										table.innerHTML += html_;
									} else {
										data.state = '待取票';
										var html_ = "<tbody><tr>" +
											"<td><img class=\'picture\' src=\'"+data.src+"\'/></td>"+
											"<td><div class=\'movie_name\'>"+data.name+"</div>"+
												"<div class=\'movie_time\'>"+data.time+"</div></td>"+
											"<td><div class=\'cinema_hall\'>"+data.cinema+"&nbsp"+data.hall+"</div>"+
												"<div class=\'seats\'>"+data.seats+"</div></td>"+
											"<td><div class=\'price\'>"+data.price+"</div></td>"+
											"<td><div class=\'state_wait\'>"+data.state+"</div>"+
													"<div class=\'code\'>"+data.code+"</div></td>"+
											"</tr></tbody>";
										table.innerHTML += html_;
									}

								table_.style.display = "block";
								document.getElementById("account_no_record").style.display = "none";
						});

					});

				});
			});
		   }
		}


		add_tr();
	})();

	function add_tr() {


	}

});
