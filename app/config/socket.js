const socket_io = require("socket.io");
const jwt = require("jsonwebtoken");
const escapeHTML = require("escape-html");
const Users = require("./../models/Users");
const Chat = require("./../models/Chat");

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
				online: true,
			},
			{
				where: {
					id: socket.decoded.user_id,
				},
			},
		).catch((err) => {
			console.log(err);
		});

		socket.on("disconnect", (reason) => {
			Users.update(
				{
					online: false,
					last_seen: Date.now(),
				},
				{
					where: {
						id: socket.decoded.user_id,
					},
				},
			).catch((err) => {
				console.log(err);
			});
			console.log("SOCKET DISCONNECTED", reason);
		});

		socket.on("message", async ({ to, data }) => {
			/**
			 * get socket id
			 */
			const chat = await Chat.create({
				sender_id: socket.decoded.user_id,
				receiver_id: to,
				message: escapeHTML(data.message),
				conversation_id: data.conversation_id,
				read: false,
			}).catch((err) => {
				console.log(err);
			});

			const user = await Users.findOne({
				where: {
					id: to,
				},
				attributes: ["socket_id"],
			});

			socket.to(user.socket_id).emit("message", {
				from: socket.decoded.user_id,
				data: {
					message_id: chat.id,
					message: data.message,
				},
			});
		});

		socket.on("unread", async ({ message_id }) => {
			await Chat.update(
				{
					read: false,
				},
				{
					where: {
						id: message_id,
					},
				},
			);
		});

		socket.on("read", async ({ message_id }) => {
			await Chat.update(
				{
					read: true,
				},
				{
					where: {
						id: message_id,
					},
				},
			);
		});
	});
};
