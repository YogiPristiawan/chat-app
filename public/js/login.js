document.getElementById("login-button").addEventListener("click", function (e) {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 200) {
				let response = JSON.parse(this.responseText);
				window.localStorage.setItem("_token", response.token);
				window.location.replace("http://localhost:3000");
			} else {
				let alert = document.getElementById("flash-message");
				let err_message = JSON.parse(this.responseText).message;
				alert.innerHTML = `
					<div class="alert alert-danger">
							${err_message}
					</div>
				`;
			}
		}
	};
	xhr.open("POST", "http://localhost:3000/auth/login");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify({ email: email, password: password }));
});
