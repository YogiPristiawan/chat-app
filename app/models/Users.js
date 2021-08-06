const { DataTypes: dt, Sequelize } = require("sequelize");
const db = require("./../config/database");

const Users = db.define(
	"Users",
	{
		id: {
			type: dt.UUIDV4,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		username: {
			type: dt.STRING(255),
			unique: {
				args: true,
				msg: "Username sudah terdaftar.",
			},
			allowNull: false,
		},
		email: {
			type: dt.STRING(255),
			unique: {
				args: true,
				msg: "Email sudah terdaftar.",
			},
			allowNull: false,
		},
		password: {
			type: dt.STRING(255),
			allowNull: false,
		},
		last_seen: {
			type: dt.BIGINT,
		},
		online: {
			type: dt.BOOLEAN,
		},
		avatar_img: {
			type: dt.STRING(255),
		},
	},
	{
		tableName: "users",
	},
);

module.exports = Users;
