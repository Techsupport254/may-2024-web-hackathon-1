const express = require("express");
const request = require("request");
const app = express();
const router = express.Router();

app.get("/tokens", (req, res) => {
	// access token
	let consumer = process.env.CONSUMER_KEY;
	let secret = process.env.SECRET_KEY;
	let url =
		"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
	let auth = new Buffer(
		consumer + ":" + secret
	).toString("base64");

	request(
		{
			url: url,
			headers: {
				Authorization: "Basic " + auth,
			},
		},
		(error, response, body) => {
			if (!error && response.statusCode === 200) {
				res.json(JSON.parse(body));
			} else {
				res.json(error);
			}
		}
	);
});

module.exports = router;
