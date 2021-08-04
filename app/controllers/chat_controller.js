const app = require("express")();

exports.new = async (req, res) => {
	const data = {
		_back: "/",
		_url: req.originalUrl,
	};

	return res.render("users", data);
};

exports.getMessage = async (req, res) => {
	const data = {
		_back: "/",
		_url: req.originalUrl,
	};
	return res.render("room", data);
};
