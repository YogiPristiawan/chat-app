const { Sequelize, Op } = require("sequelize");
const Chat = require("./../models/chat");
const Users = require("./../models/users");
exports.index = async (req, res) => {
	const user_id = "3a285c6f-675b-4503-8a84-90f5c392cb3c";
	const chat_list = await Chat.findAll({
		attributes: [
			"message",
			"created_at",
			[
				Sequelize.literal(
					`CASE WHEN sender.id = '${user_id}' THEN receiver.username ELSE sender.username END`,
				),
				"participant",
			],
			[
				Sequelize.literal(
					`CASE WHEN sender.id = '${user_id}' THEN receiver.id ELSE sender.id END`,
				),
				"participant_id",
			],
		],
		raw: true,
		include: [
			{
				model: Users,
				as: "sender",
				required: true,
				attributes: [],
			},
			{
				model: Users,
				as: "receiver",
				required: true,
				attributes: [],
			},
		],
		where: {
			id: {
				[Op.in]: [
					Sequelize.literal(
						`SELECT MAX(id) FROM chat WHERE sender_id = '${user_id}' OR receiver_id = '${user_id}' GROUP BY conversation_id`,
					),
				],
			},
		},
	});

	const data = {
		chat_list,
		_url: req.originalUrl,
	};

	return res.render("index", data);
};
