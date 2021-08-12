const socket = io("http://localhost:3000", {
	auth: {
		token: window.localStorage.getItem("_token"),
	},
	transports: ["websocket"],
});

socket.on("message", ({ socket_id, message }) => {
	console.log("message: ", message);
});

socket.on("connect", () => {
	console.log("connected: ", socket.id);
});

socket.on("connect_error", (e) => {
	console.log(e.message);
});

socket.on("disconnect", (reason) => {
	console.log(reason);
});

export default socket;
