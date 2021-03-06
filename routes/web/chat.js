const app = require("express")();
const chat = require("express").Router();
const { engine } = require("express-edge");

const ChatController = require("./../../app/controllers/chat_controller");
const HomeController = require("./../../app/controllers/home_controller");

chat.get("/new", (req, res, next) => {
	ChatController.new(req, res);
});

chat.get("/:partner_id", (req, res) => {
	// console.log(req.params);
	ChatController.getMessage(req, res);
});

chat.post("/:partner_id/send", (req, res) => {
	ChatController.sendMessage(req, res);
});

app.use("/chat", engine, chat);

module.exports = app;
