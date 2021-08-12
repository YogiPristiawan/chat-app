import socket from "./socket.js";
const send_message = document.getElementById("send-message");
send_message.addEventListener("click", function (e) {
	const message = document.getElementById("message").value;
	if (message != "") {
		const conversation_id =
			document.getElementById("conversation_id").value;
		const partner_id = document.getElementById("partner_id").value;
		/**
		 * Ajax request
		 */
		// const xhr = new XMLHttpRequest();
		// xhr.onreadystatechange = function (e) {
		// 	if (this.readyState === 4) {
		// 		if (this.status === 200) {
		// 		} else {
		// 		}
		// 	}
		// };

		// xhr.open("POST", `http://localhost:3000/chat/${partner_id}/send`);
		// xhr.setRequestHeader("Content-Type", "application/json");
		// xhr.send(
		// 	JSON.stringify({
		// 		message,
		// 		conversation_id,
		// 	}),
		// );

		const chat_room = document.getElementById("chat-room");
		chat_room.innerHTML += `
		<div class="mt-1 msg-send-wrap">
			<div class="talk-bubble round right-top tri-right send ml-auto m-0 border">
				<div class="talktext p-3">
					<p>
						${message}
					</p>
				</div>
			</div>
		</div>
		`;
		document.getElementById("message").value = "";
		socket.emit("message", {
			to: partner_id,
			data: {
				message: message,
				conversation_id: conversation_id,
			},
		});
	} else {
		alert("pesan ngga boleh kosong");
	}
});
