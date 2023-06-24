const axios = require("axios");
require("dotenv").config();

const createToken = async (req, res, next) => {
	const secret = process.env.SECRET_KEY;
	const consumer = process.env.CONSUMER_KEY;
	const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate";
	const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");

	await axios
		.get(url, {
			headers: {
				Authorization: `Basic ${auth}`,
			},
		})
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((err) => {
			res.status(400).json({
				message: "Error fetching token",
				error: err,
			});
		});
};

module.exports = { createToken };
