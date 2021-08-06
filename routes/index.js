const router = require("express").Router();
const HomeController = require("./../app/controllers/home_controller");
const chat = require("./web/chat");
const auth = require("./web/auth");

router.get("/", (req, res) => {
	HomeController.index(req, res);
});

router.use(chat);
router.use(auth);

module.exports = router;
