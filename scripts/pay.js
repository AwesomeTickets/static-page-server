$(document).ready(function() {
	$("#returnToStore").click(function() {
		window.location = "store.html";
	});

	$("#pay").click(function() {
		window.location = "home.html";
		alert("支付成功！");
	})
});