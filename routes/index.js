const router = require("express").Router();
const HomeController = require("./../app/controllers/home_controller");
const chat = require("./web/chat");
const auth = require("./web/auth");
const user = require("./web/user");

router.get("/", (req, res) => {
	HomeController.index(req, res);
});

router.use(chat);
router.use(auth);
router.use(user);

module.exports = router;
