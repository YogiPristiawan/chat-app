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
