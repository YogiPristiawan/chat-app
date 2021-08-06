const Users = require("./../models/Users");
const { DateTime } = require("luxon");
const { timeSince } = require("./../helpers/datetime");

exports.new = async (req, res) => {
	const users = await Users.findAll({
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
