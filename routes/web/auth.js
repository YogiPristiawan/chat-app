const app = require("express")();
const { engine } = require("express-edge");
const auth = require("express").Router();
const AuthController = require("./../../app/controllers/auth_controller");

auth.get("/login", (req, res) => {
	AuthController.index(req, res);
});

auth.post("/login", (req, res) => {
	AuthController.login(req, res);
});

auth.get("/register", (req, res) => {
	AuthController.register(req, res);
});

auth.post("/register", (req, res) => {
	AuthController.store(req, res);
});

app.use("/auth", engine, auth);

module.exports = app;
