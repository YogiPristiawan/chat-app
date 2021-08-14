const bcrypt = require("bcrypt");
const escapeHTML = require("escape-html");
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
		// return res.redirect("/auth/login");
		return res.status(404).json({ message: "Email belum terdaftar." });
	}

	const match = await bcrypt.compare(req.body.password, users.password);
	if (!match) {
		req.flash("message", {
			status: 401,
			message: "Password yang anda masukkan salah.",
		});
		// return res.redirect("/auth/login");
		return res
			.status(401)
			.json({ message: "Password yang anda masukkan salah." });
	}
	const token = jwt.sign(
		{
			iat: Math.floor(Date.now() / 1000),
			user_id: users.id,
			username: users.username,
		},
		process.env.JWT_SECRET,
		{
			algorithm: process.env.JWT_ENCRYPT || "HS256",
			expiresIn: 7500,
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
	req.session.avatar_img = users.avatar_img;
	req.session.token = token;
	req.session._login = true;
	return res.status(200).json({
		username: users.username,
		email: users.email,
		user_id: users.id,
		token: token,
	});
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

	if (password.length < 6) {
		req.flash("message", {
			status: 400,
			message: "Password harus berisi setidaknya 6 karakter.",
		});
	}

	if (password != confirm_password) {
		req.flash("message", {
			status: 400,
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

exports.logout = async (req, res) => {
	await req.session.destroy();
	return res.redirect("/");
};
