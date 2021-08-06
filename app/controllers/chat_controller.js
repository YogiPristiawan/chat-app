const Database = require("./../config/database");

exports.new = async (req, res) => {
	const data = {
		_back: "/",
		_url: req.originalUrl,
	};
	const db = new Database();
	console.log(db.pool);
	return res.render("users", data);
};

exports.getMessage = async (req, res) => {
	const data = {
		_back: "/",
		_url: req.originalUrl,
	};
	return res.render("room", data);
};
