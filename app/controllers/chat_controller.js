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
	const sender_id = "3a285c6f-675b-4503-8a84-90f5c392cb3c";
	const partner_id = req.params.partner_id;
	const chat = await Chat.findAll({
		where: {
			[Op.or]: [
				{
					sender_id: "3a285c6f-675b-4503-8a84-90f5c392cb3c",
					receiver_id: partner_id,
				},
				{
					sender_id: partner_id,
					receiver_id: "3a285c6f-675b-4503-8a84-90f5c392cb3c",
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

	const data = {
		chats: chat,
		token: req.session.token,
		user_id: "3a285c6f-675b-4503-8a84-90f5c392cb3c",
		_back: "/",
		_url: req.originalUrl,
	};
	return res.render("room", data);
};
