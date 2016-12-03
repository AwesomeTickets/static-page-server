$(document).ready(function() {
	$("#goToSignup").click(function() {
		window.location = "layouts/signup.html";
	});

	$( "#signin" ).click(function( event ) {
		var username = $("#inputUsernameSignin")[0].value;
		var password = $("#inputPasswordSignin")[0].value;
		var us = validator.isUsernameValid(username);
		// console.log("username: ", username);
		// console.log("password: ", password);
		// console.log('us: ', us);
		if (!us) {
			event.preventDefault();
			$("#signinErrorMessage").text("用户名不正确");
		} else {
			$("#signinErrorMessage").text("");
		}
	});
});
