const { Pool } = require("pg");

class Database {
	constructor() {
		this.pool = new Pool({
			user: "postgres",
			password: "root",
			host: "127.0.0.1",
			port: "5432",
			database: "chat_app",
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		});
		if (!Database._instance) {
			Database._instance = this;
		}
		return Database._instance;
	}
}

module.exports = Database;
