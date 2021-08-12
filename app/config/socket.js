const socket_io = require("socket.io");
const jwt = require("jsonwebtoken");
const escapeHTML = require("escape-html");
const Users = require("./../models/Users");
const Chat = require("../models/chat");

module.exports.listen = function (server) {
	const io = socket_io(server, {});

	io.use((socket, next) => {
		if (!socket.handshake.auth.token)
			return next(new Error("Token required."));
		try {
			const token = socket.handshake.auth.token;
			jwt.verify(
				token,
				process.env.JWT_SECRET,
				{
					algorithms: process.env.JWT_ENCRYPT || "HS256",
				},
				(err, decoded) => {
					if (err) return next(new Error(err));
					socket.decoded = decoded;
					return next();
				},
			);
		} catch (err) {
			console.log(err);
		}
	});

	io.on("connection", (socket) => {
		console.log("SOCKET CONNECTED");
		/**
		 * insert asynchrounusly
		 */
		Users.update(
			{
				socket_id: socket.id,
			},
			{
				where: {
					id: socket.decoded.user_id,
				},
			},
		).catch((err) => {
			console.log(err);
		});

		socket.on("message", async ({ to, data }) => {
			/**
			 * get socket id
			 */
			// Chat.create({
			// 	sender_id: socket.decoded.user_id,
			// 	receiver_id: to,
			// 	message: escapeHTML(data.message),
			// 	conversation_id: data.conversation_id,
			// }).catch((err) => {
			// 	console.log(err);
			// });

			const user = await Users.findOne({
				where: {
					id: to,
				},
				attributes: ["socket_id"],
			});

			socket
				.to(user.socket_id)
				.emit("message", {
					from: socket.decoded.user_id,
					message: data.message,
				});
		});
	});
};
