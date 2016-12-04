$(document).ready(function() {
	$("#returnToStore").click(function() {
		window.location = "store.html";
	});

	$("#pay").click(function() {
		window.location = "home.html";
		alert("支付成功！");
		$.post("/pay", "niurouhanbao*2*12,sanmingzhi*1*8");
	})
});