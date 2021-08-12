const socket = io("http://localhost:3000", {
	auth: {
		token: window.localStorage.getItem("_token"),
	},
	transports: ["websocket"],
});

socket.on("message", ({ from, message }) => {
	const pathname = window.location.pathname;
	const pattern = `/chat/${from}`;
	if (pathname.match(new RegExp(pattern))) {
		const chat_room = document.getElementById("chat-room");
		chat_room.innerHTML += `
		<div class="mt-1 msg-receive-wrap">
			<div class="talk-bubble round right-top tri-right receive ml-auto m-0 border">
				<div class="talktext p-3">
					<p>
						${message}
					</p>
				</div>
			</div>
		</div>
		`;
	} else if (pathname.match(/\//)) {
		const message_preview = document.getElementById(
			"message-preview-" + from,
		);
		message_preview.innerHTML = `
			<small>
				${message}
			</small>	
		`;
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

console.log(window.location.pathname);

export default socket;
