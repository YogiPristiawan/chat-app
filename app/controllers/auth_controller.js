const bcrypt = require("bcrypt");
const escapeHTML = require("escape-html");
const { v4: uuidv4 } = require("uuid");
const { DateTime } = require("luxon");
const jwt = require("jsonwebtoken");
const Users = require("./../models/Users");

exports.index = async (req, res) => {
	const flash = (await req.consumeFlash("message"))[0];
	const data = {
		title: "Halaman Login",
		_flashMessage: flash,
	};
	return res.render("auth/login", data);
};

exports.login = async (req, res) => {
	const users = await Users.findOne({
		where: {
			email: req.body.email,
		},
	});

	if (users == null) {
		req.flash("message", {
			status: 404,
			message: "Email belum terdaftar.",
		});
		return res.redirect("/auth/login");
	}

	const match = await bcrypt.compare(req.body.password, users.password);
	if (!match) {
		req.flash("message", {
			status: 401,
			message: "Password yang anda masukkan salah.",
		});
		return res.redirect("/auth/login");
	}
	const token = jwt.sign(
		{
			iat: Math.floor(Date.now() / 1000),
			user_id: users.id,
			username: users.username,
		},
		process.env.JWT_SECRET,
		{
			algorithm: "HS256",
			expiresIn: "2h",
		},
	);
	await Users.update(
		{
			token: token,
		},
		{
			where: {
				id: users.id,
			},
		},
	);
	req.session.user_id = users.id;
	req.session.email = users.email;
	req.session.username = users.username;
	req.session.token = token;
	req.session._login = true;
	return res.redirect("/");
};

exports.register = async (req, res) => {
	const flash = (await req.consumeFlash("message"))[0];
	const data = {
		_flashMessage: flash,
	};
	return res.render("auth/register", data);
};

exports.store = async (req, res) => {
	const username = escapeHTML(req.body.username);
	const email = escapeHTML(req.body.email);
	const password = req.body.password;
	const confirm_password = req.body.confirm_password;

	if (password != confirm_password) {
		req.flash("message", {
			status: 401,
			message: "Password tidak cocok.",
		});
		return res.redirect("/auth/register");
	}
	try {
		await Users.create({
			username: username,
			email: email,
			password: await bcrypt.hash(password, 12),
		});
		req.flash("message", {
			status: 200,
			message: "Berhasil mendaftar",
		});
		return res.redirect("/auth/login");
	} catch (err) {
		console.log(err.errors);
		req.flash("message", {
			status: 400,
			message: err.errors[0].message,
		});

		return res.redirect("/auth/register");
	}
};
