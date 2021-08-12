const socket_io = require("socket.io");
const Users = require("./../models/Users");

module.exports.listen = function (server) {
	const io = socket_io(server, {});
	io.on("connection", (socket) => {
		console.log("SOCKET CONNECTED");
	});
};
