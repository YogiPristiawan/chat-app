const router = require("express").Router();
const chat = require("./web/chat");
const { engine } = require("express-edge");
const HomeController = require("./../app/controllers/home_controller");
const ChatController = require("./../app/controllers/chat_controller");

router.get("/", engine, (req, res) => {
	HomeController.index(req, res);
});

router.use(chat);

module.exports = router;
