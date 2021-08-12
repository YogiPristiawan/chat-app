const { Sequelize } = require("sequelize");

const db = new Sequelize(
	process.env.DB_DATABASE,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "postgres",
		define: {
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: "deleted_at",
		},
		timezone: "Asia/Jakarta",
		logging: false,
	},
);

(async () => {
	try {
		await db.authenticate();
		return console.log("database connection success");
	} catch (error) {
		console.log("failed to connect database, Error: " + error);
		db.close();
	}
})();

module.exports = db;
