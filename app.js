require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes/index");

app.use(routes);
app.use(express.static(__dirname + "/public"));
app.set("views", `${__dirname}/views`);

app.listen(process.env.APP_PORT || 3000, () => {
	console.log(`application listen in port ${process.env.APP_PORT}`);
});
