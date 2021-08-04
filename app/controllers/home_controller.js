const app = require("express")();

exports.index = async (req, res) => {
	const data = {
		_url: req.originalUrl,
	};

	return res.render("index", data);
};
