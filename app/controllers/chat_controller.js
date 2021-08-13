const Users = require("./../models/Users");
const { Op } = require("sequelize");
const { timeSince } = require("./../helpers/datetime");
const Chat = require("./../models/chat");
const { response } = require("express");
const escapeHTML = require("escape-html");
const { Sequelize } = require("sequelize");

exports.new = async (req, res) => {
	const users = await Users.findAll({
		where: {
			id: {
				[Op.ne]: req.session.user_id,
			},
		},
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
		_avatar_img: req.session.avatar_img,
		_username: req.session.username,
	};

	return res.render("users", data);
};

exports.getMessage = async (req, res) => {
	const user_id = req.session.user_id;
	const partner_id = req.params.partner_id;

	/**
	 * update asynchronusly
	 */
	if (req.query.unread) {
		Chat.update(
			{
				read: true,
			},
			{
				where: {
					sender_id: partner_id,
					receiver_id: user_id,
				},
			},
		).catch((err) => {
			console.log(err);
		});
	}

	const chat = await Chat.findAll({
		where: {
			[Op.or]: [
				{
					sender_id: user_id,
					receiver_id: partner_id,
				},
				{
					sender_id: partner_id,
					receiver_id: user_id,
				},
			],
		},
		order: [["id", "ASC"]],
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

	/**
	 * get data partner
	 */
	const partner = await Users.findOne({
		attributes: ["id", "username", "avatar_img"],
		where: {
			id: partner_id,
		},
	});

	let data = {
		chats: chat,
		token: req.session.token,
		partner: {
			id: partner.id,
			username: partner.username,
			avatar_img: partner.avatar_img,
		},
		user_id: user_id,
		_back: "/",
		_url: req.originalUrl,
		_avatar_img: req.session.avatar_img,
		_username: req.session.username,
	};

	if (chat.length == 0) {
		const users = await Users.findAll({
			where: {
				[Op.or]: [{ id: user_id }, { id: partner_id }],
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

// belum dipakai
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
