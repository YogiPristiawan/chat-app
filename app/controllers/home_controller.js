const { Sequelize, Op, QueryTypes } = require("sequelize");
const db = require("./../config/database");
exports.index = async (req, res) => {
	const user_id = req.session.user_id;
	const chat_list = await db.query(
		`
									with unread as (
									select	
									sender_id,
									(case
									when
										count(read) = 0
									then
										0
									else
										count(read)
									end) as unread
									from
										chat
									where receiver_id = :user_id
									and read = false
									group by read, sender_id
								)
								select
									(
									case
									when
										u1.id = :user_id
									then
										u2.id
									else
										u1.id
									end
									) as participant_id,
									(case
									when		
										u1.id = :user_id
									then
										u2.username
									else
										u1.username
									end) as participant,
									(
										case
										when
											u1.id = :user_id
										then
											u2.online
										else
											u1.online
										end
									) as online,
									(
										case
										when
											u1.id = :user_id
										then
											u2.avatar_img
										else
											u1.avatar_img
										end
									) as avatar_img,
									chat.message,
									chat.created_at,								
									unread.unread
								from chat
								left join
									unread on unread.sender_id = chat.sender_id
								inner join
									users as u1 on u1.id = chat.sender_id
								inner join
									users as u2 on u2.id = chat.receiver_id
								where chat.id in (
									select
										max(id)
									from chat
									where sender_id = :user_id
									or receiver_id = :user_id
									group by conversation_id
								)
								order by chat.created_at desc
								`,
		{
			replacements: {
				user_id: user_id,
			},
			type: QueryTypes.SELECT,
		},
	);
	console.log(chat_list);
	const data = {
		chat_list,
		_url: req.originalUrl,
		_avatar_img: req.session.avatar_img,
		_username: req.session.username,
	};

	return res.render("index", data);
};
