const Users = require("./../models/Users");
const { Op } = require("sequelize");
const { timeSince } = require("./../helpers/datetime");
const Chat = require("./../models/chat");

exports.new = async (req, res) => {
	const users = await Users.findAll({
		order: [
			["online", "DESC"],
			["last_seen", "DESC"],
		],
	});

	users.forEach((v, i) => {
		v.last_seen =
			"terakhir dilihat " + timeSince(v.last_seen) + " yang lalu";
	});
	const data = {
		users: users,
		_back: "/",
		_url: req.originalUrl,
	};

	return res.render("users", data);
};

exports.getMessage = async (req, res) => {
	// const sender_id = req.session.user_id;
	const partner_id = req.params.partner_id;
	const chat = await Chat.findAll({
		where: {
			[Op.or]: [
				{
					sender_id: "1fc0cad0-2853-4129-b251-da982f13169b",
					receiver_id: partner_id,
				},
				{
					sender_id: partner_id,
					receiver_id: "1fc0cad0-2853-4129-b251-da982f13169b",
				},
			],
		},
		include: [
			{
				model: Users,
				as: "sender",
				required: true,
				attributes: ["id", "username"],
			},
			{
				model: Users,
				as: "receiver",
				required: true,
				attributes: ["id", "username"],
			},
		],
	});
	chat.forEach((v, i) => {
		console.log(v);
	});

	console.log(chat.length);
	const data = {
		chats: chat,
		user_id: "1fc0cad0-2853-4129-b251-da982f13169b",
		_back: "/",
		_url: req.originalUrl,
	};
	return res.render("room", data);
};
