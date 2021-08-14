const app = require("express")();
const user = require("express").Router();
const { engine } = require("express-edge");
const UserController = require("./../../app/controllers/user_controller");

user.get("/profile", (req, res) => {
	UserController.profile(req, res);
});

user.post("/profile/update", (req, res) => {
	UserController.profileUpdate(req, res);
});

user.get("/profile/delete-avatar", (req, res) => {
	UserController.deleteAvatar(req, res);
});

app.use("/user", engine, user);

module.exports = app;
