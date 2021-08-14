const Users = require("./../models/Users");
const multer = require("multer");
const path = require("path");
const fsPromises = require("fs/promises");

exports.profile = async (req, res) => {
	const flash = (await req.consumeFlash("message"))[0];
	const data = {
		title: "Halaman Profile",
		username: req.session.username,
		_flashMessage: flash,
		_url: req.originalUrl,
		_username: req.session.username,
		_avatar_img: req.session.avatar_img,
		_back: "/",
	};
	return res.render("profile", data);
};

exports.profileUpdate = async (req, res) => {
	/**
	 * multer middleware
	 */
	const upload = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, "./public/img");
			},
			filename: function (req, file, cb) {
				const uniqueSuffix =
					Date.now() + "-" + Math.round(Math.random() * 1e9);
				cb(
					null,
					"profile-" +
						uniqueSuffix +
						path.extname(file.originalname).toLowerCase(),
				);
			},
		}),
		limits: {
			fileSize: 250000,
			files: 1,
		},
		fileFilter: function (req, file, cb) {
			const filetypes = /jpeg|jpg|png|gif/;
			const extname = filetypes.test(
				path.extname(file.originalname).toLowerCase(),
			);
			const mimetype = filetypes.test(file.mimetype);

			if (mimetype && extname) {
				return cb(null, true);
			} else {
				cb("Error: Images Only!");
			}
		},
	}).single("avatar_img");

	/**
	 * do upload
	 */
	upload(req, res, async function (err) {
		try {
			const username = req.body.username;
			if (err instanceof multer.MulterError) {
				throw new Error(err);
			} else if (err) {
				throw new Error(err);
			}

			if (req.session.avatar_img !== null && req.file) {
				fsPromises
					.unlink(`public\\img\\${req.session.avatar_img}`)
					.catch((err) => {
						console.log(err);
					});
			}

			let data_update = {
				username: username,
			};
			if (req.file) {
				data_update.avatar_img = req.file.filename;
			}
			const update = await Users.update(data_update, {
				where: {
					id: req.session.user_id,
				},
			});

			/**
			 * update session
			 */
			if (update) {
				if (req.file) {
					req.session.avatar_img = req.file.filename;
				}
				req.session.username = username;
			}

			req.flash("message", {
				status: 200,
				message: "Berhasil update profile.",
			});

			return res.redirect("/user/profile");
		} catch (err) {
			console.log(err);
			req.flash("message", {
				status: 400,
				message: err.message,
			});
			return res.redirect("/user/profile");
		}
	});
};

exports.deleteAvatar = async (req, res) => {
	const user_id = req.session.user_id;
	const avatar_img = req.session.avatar_img;

	try {
		await Users.update(
			{
				avatar_img: null,
			},
			{
				where: {
					id: user_id,
				},
			},
		);
		await fsPromises.unlink(`public\\img\\${avatar_img}`);
		req.session.avatar_img = null;
		req.flash("message", {
			status: 200,
			message: "Berhasil update profile.",
		});
		return res.redirect("/user/profile");
	} catch (err) {
		console.log(err);
		req.flash("message", {
			status: 500,
			message: "Gagal hapus avatar.",
		});
		return res.redirect("/user/profile");
	}
};
