const Users = require("./../models/Users");
const { Op } = require("sequelize");
const { timeSince } = require("./../helpers/datetime");
const Chat = require("./../models/chat");
const { response } = require("express");
const escapeHTML = require("escape-html");

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
	const sender_id = req.session.user_id;
	const partner_id = req.params.partner_id;
	const chat = await Chat.findAll({
		where: {
			[Op.or]: [
				{
					sender_id: req.session.user_id,
					receiver_id: partner_id,
				},
				{
					sender_id: partner_id,
					receiver_id: req.session.user_id,
				},
			],
		},
		include: [
			{
				model: Users,
				as: "sender",
				required: true,
				attributes: ["id", "username", "user_conversation_id"],
			},
			{
				model: Users,
				as: "receiver",
				required: true,
				attributes: ["id", "username", "user_conversation_id"],
			},
		],
	});

	let data = {
		chats: chat,
		token: req.session.token,
		partner_id: partner_id,
		user_id: req.session.user_id,
		_back: "/",
		_url: req.originalUrl,
	};

	if (chat.length == 0) {
		const users = await Users.findAll({
			where: {
				[Op.or]: [{ id: req.session.user_id }, { id: partner_id }],
			},
			attributes: ["user_conversation_id"],
		});

		/**
		 * generate conversation_id
		 */
		let conversation_id = undefined;
		if (users[1].user_conversation_id > users[0].user_conversation_id) {
			conversation_id = `${users[0].user_conversation_id}_${users[1].user_conversation_id}`;
		} else {
			conversation_id = `${users[1].user_conversation_id}_${users[0].user_conversation_id}`;
		}
		data.conversation_id = conversation_id;
	}
	return res.render("room", data);
};

exports.sendMessage = async (req, res) => {
	const receiver_id = req.params.partner_id;
	const message = escapeHTML(req.body.message);
	const conversation_id = req.body.conversation_id;

	/**
	 * insert asyncrhonusly
	 */
	Chat.create({
		sender_id: req.session.user_id,
		receiver_id: receiver_id,
		message: message,
		conversation_id: conversation_id,
	}).catch((err) => {
		console.log(err);
	});

	const user = await Users.findOne({
		where: {
			id: receiver_id,
		},
		attributes: ["socket_id"],
	});

	if (user == null) return res.send(404).json({ message: "Not found." });
	return res.send(200).json({ data: user.socket_id });
};
