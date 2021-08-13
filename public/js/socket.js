const socket = io("http://localhost:3000", {
	auth: {
		token: window.localStorage.getItem("_token"),
	},
	transports: ["websocket"],
});
// const socket = io("https://3bac9eace51b.ngrok.io", {
// 	auth: {
// 		token: window.localStorage.getItem("_token"),
// 	},
// 	transports: ["websocket"],
// });

socket.on("message", ({ from, data }) => {
	const pathname = window.location.pathname;
	const pattern = `/chat/${from}`;
	if (pathname.match(new RegExp(pattern))) {
		const chat_room = document.getElementById("chat-room");

		/**
		 * emit read event
		 */
		socket.emit("read", { message_id: data.message_id });

		chat_room.innerHTML += `
		<div class="mt-1 msg-receive-wrap">
			<div class="talk-bubble round right-top tri-right receive ml-auto m-0 border">
				<div class="talktext p-3">
					<p>
						${data.message}
					</p>
				</div>
			</div>
		</div>
		`;
	} else if (pathname.match(/\//)) {
		const message_preview = document.getElementById(
			"message-preview-" + from,
		);
		const message_count = document.getElementById("message-count-" + from);

		/**
		 * emit unread
		 */
		socket.emit("unread", { message_id: data.message_id });

		message_preview.innerHTML = `
		<small>
		${data.message}
		</small>	
		`;

		let count = message_count.innerHTML;
		message_count.innerHTML = Number(count) + 1;
		message_count.style.display = "inline-block";
	}
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

/**
 * delete token
 */
document.getElementById("logout").addEventListener("click", function (e) {
	window.localStorage.removeItem("_token");
	socket.disconnect();
});

export default socket;
