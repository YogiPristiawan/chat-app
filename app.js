require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const session = require("express-session");
const { flash } = require("express-flash-message");
const { config, engine } = require("express-edge");
const routes = require("./routes/index");
const io = require("./app/config/socket");

io.listen(server);

app.use(express.static(__dirname + "/public"));
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 2 * 3600 * 1000,
		},
	}),
);
app.use(flash({ sessionKeyName: "flashMessage" }));
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
app.set("views", `${__dirname}/views`);
app.use(routes);

server.listen(process.env.APP_PORT || 3000, () => {
	console.log(`application listen in port ${process.env.APP_PORT}`);
});
