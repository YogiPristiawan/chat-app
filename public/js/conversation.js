const send_message = document.getElementById("send-message");
const socket = io("http://localhost:3000");

send_message.addEventListener("click", function (e) {
	const user_message = document.getElementById("user-message").value;

	socket.emit("message", "hello");
});

socket.on("message", (message) => {
	console.log("message: ", message);
});

socket.on("connect", () => {
	console.log(socket.id);
});
