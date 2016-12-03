$(document).ready(function() {
	$("#returnToSignin").click(function() {
		window.location = "../index.html"
	});

	$("#signup").click(function(event) {
		var name = $("#inputNameSignup")[0].value;
		var sex = $("#inputSexSignup")[0].value;
		var phone = $("#inputPhoneSignup")[0].value;
		var address = $("#inputAddressSignup")[0].value;
		var username = $("#inputUsernameSignup")[0].value;
		var password = $("#inputPasswordSignup")[0].value;

		var na = validator.isNameValid(name);
		var se = validator.isSexValid(sex);
		var ph = validator.isPhoneValid(phone);
		var ad = validator.isAddressValid(address);
		var us = validator.isUsernameValid(username);
		var ps = validator.isPasswordValid(password);
		if (!na) {
			$("#signupErrorMessage").text(validator.form.name.errorMessage);
			event.preventDefault();			
		} else if (!se) {
			$("#signupErrorMessage").text(validator.form.sex.errorMessage);
			event.preventDefault();
		} else if (!ph) {
			$("#signupErrorMessage").text(validator.form.phone.errorMessage);
			event.preventDefault();
		} else if (!ad) {
			$("#signupErrorMessage").text(validator.form.address.errorMessage);
			event.preventDefault();
		} else if (!us) {
			$("#signupErrorMessage").text(validator.form.username.errorMessage);
			event.preventDefault();
		} else if (!ps) {
			$("#signupErrorMessage").text(validator.form.password.errorMessage);
			event.preventDefault();
		} else {
			$("#signupErrorMessage").text("");
		}  
	});
});