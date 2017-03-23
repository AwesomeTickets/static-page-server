// import next from 'next'

// console.log(next);
$(document).ready(function() {
	$("#next").click(function() {
		window.location = "layouts/next.html";
	});

	let a = 1;
});

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}