const token = window.localStorage.getItem("_token");
if (!token) {
	window.location.replace("http://localhost:3000/auth/login");
}
