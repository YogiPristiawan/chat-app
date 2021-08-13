const Users = require("./../models/Users");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const { nextTick } = require("process");

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

			await Users.update(
				{
					avatar_img: req.file.filename,
					username: username,
				},
				{
					where: {
						id: req.session.user_id,
					},
				},
			);

			/**
			 * update session
			 */
			req.session.avatar_img = req.file.filename;
			req.session.username = username;

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
