const Database = require("./../config/database");

exports.index = async (req, res) => {
	const flash = (await req.consumeFlash("message"))[0];
	console.log(flash);
	const data = {
		title: "Halaman Login",
		_flashMessage: flash,
	};
	console.log(data);
	return res.render("auth/login", data);
};

exports.login = async (req, res) => {
	const db = new Database();
	await (async function () {
		try {
			const client = await db.pool.connect();
			const query = {
				text: "SELECT * FROM users WHERE email = $1",
				values: [req.body.email],
			};
			const users = (await client.query(query)).rows;
			if (users.length != 0) {
				if (users[0].password == req.body.password) {
					req.session.email = users[0].email;
					req.session.username = users[0].username;
					req.session._login = true;
					return res.redirect("/");
				}
				await req.flash("message", {
					status: 401,
					message: "Password yang anda masukkan salah.",
				});
				return res.redirect("/auth/login");
			}
			await req.flash("message", {
				status: 404,
				message: "Email tidak terdaftar.",
			});
			return res.redirect("/auth/login");
		} catch (err) {
			console.log(err);
			return res.status(500).send("Terjadi kesalahan.");
		}
	})();
};
