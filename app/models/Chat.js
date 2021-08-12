const { DataTypes: dt, Sequelize } = require("sequelize");
const db = require("./../config/database");
const Users = require("./Users");

const Chat = db.define(
	"Chat",
	{
		id: {
			type: dt.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		sender_id: {
			type: dt.CHAR(36),
			allowNull: false,
		},
		receiver_id: {
			type: dt.CHAR(36),
			allowNull: false,
		},
		message: {
			type: dt.TEXT,
		},
		conversation_id: {
			type: dt.STRING,
		},
	},
	{
		tableName: "chat",
	},
);

Chat.belongsTo(Users, {
	foreignKey: "sender_id",
	targetKey: "id",
	as: "sender",
});
Chat.belongsTo(Users, {
	foreignKey: "receiver_id",
	targetKey: "id",
	as: "receiver",
});

module.exports = Chat;
