const app = require("express")();
const user = require("express").Router();
const { engine } = require("express-edge");
const multer = require("multer");
const path = require("path");
/**
 * define upload middleware
 */
// const upload = multer({
// 	storage: multer.diskStorage({
// 		destination: function (req, file, cb) {
// 			cb(null, "./public/img");
// 		},
// 		filename: function (req, file, cb) {
// 			const uniqueSuffix =
// 				Date.now() + "-" + Math.round(Math.random() * 1e9);
// 			cb(
// 				null,
// 				"profile-" +
// 					uniqueSuffix +
// 					path.extname(file.originalname).toLowerCase(),
// 			);
// 		},
// 	}),
// 	limits: {
// 		fileSize: 512000,
// 		files: 1,
// 	},
// 	fileFilter: function (req, file, cb) {
// 		const filetypes = /jpeg|jpg|png|gif/;
// 		const extname = filetypes.test(
// 			path.extname(file.originalname).toLowerCase(),
// 		);
// 		const mimetype = filetypes.test(file.mimetype);

// 		if (mimetype && extname) {
// 			return cb(null, true);
// 		} else {
// 			cb("Error: Images Only!");
// 		}
// 	},
// }).single("avatar_img");

const UserController = require("./../../app/controllers/user_controller");

user.get("/profile", (req, res) => {
	UserController.profile(req, res);
});

user.post("/profile/update", (req, res) => {
	UserController.profileUpdate(req, res);
});

app.use("/user", engine, user);

module.exports = app;
