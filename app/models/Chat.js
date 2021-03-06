const { DataTypes: dt, Sequelize } = require("sequelize");
const db = require("../config/database");
const Users = require("./Users");

const chat = db.define(
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
		read: {
			type: dt.BOOLEAN,
		},
	},
	{
		tableName: "chat",
	},
);

chat.belongsTo(Users, {
	foreignKey: "sender_id",
	targetKey: "id",
	as: "sender",
});
chat.belongsTo(Users, {
	foreignKey: "receiver_id",
	targetKey: "id",
	as: "receiver",
});

module.exports = chat;
