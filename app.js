require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const session = require("express-session");
const { flash } = require("express-flash-message");
const { engine } = require("express-edge");
const Redis = require("ioredis");
const redis = new Redis({
	port: process.env.REDIS_PORT || 6379,
	host: process.env.REDIS_HOST || "127.0.0.1",
	family: 4,
	password: process.env.REDIS_PASSWORD || "",
	db: 0,
});
let RedisStore = require("connect-redis")(session);
const routes = require("./routes/index");
const io = require("./app/config/socket");

io.listen(server);

app.use(express.static(__dirname + "/public"));
app.use(
	session({
		secret: process.env.SESSION_SECRET || "not secret",
		store: new RedisStore({ client: redis }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 2 * 3600 * 1000,
		},
	}),
);
app.use(flash({ sessionKeyName: "flashMessage" }));
// app.use((req, res, next) => {
// 	req.session.user_id = "3a285c6f-675b-4503-8a84-90f5c392cb3c";
// 	req.session.email = "yogi@gmail.com";
// 	req.session.username = "Yogi Pristiaawan";
// 	req.session.avatar_img = null;
// 	return next();
// });
app.use((req, res, next) => {
	if (
		req.originalUrl == "/auth/login" ||
		req.originalUrl == "/auth/register"
	) {
		return next();
	} else {
		if (req.session._login) {
			return next();
		}
	}

	res.redirect("/auth/login");
});

app.use(engine);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("views", `${__dirname}/views`);
app.use(routes);

server.listen(process.env.APP_PORT || 3000, () => {
	console.log(`application listen in port ${process.env.APP_PORT}`);
});
