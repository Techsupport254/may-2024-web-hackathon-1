const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
const Port = process.env.PORT || 5000;
app.get("/", (req, res) => {
	res.send(`API running on port ${Port}`);
});

app.listen(Port, () => {
	console.log(`Server running on port ${Port}`);
});
