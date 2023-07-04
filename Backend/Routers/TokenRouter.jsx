const axios = require("axios");
const router = require("express").Router();
const Transaction = require("../Models/PaymentModel.jsx");

// register url
router.get("/register", accessToken, (req, res, next) => {
	let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
	let auth = "Bearer " + req.access_token;

	axios
		.post(
			url,
			{
				ShortCode: process.env.SHORT_CODE,
				ResponseType: "Completed",
				ConfirmationURL: "http://102.215.76.91/tokens/confirmation",
				ValidationURL: "http://102.215.76.91/tokens/validation",
			},
			{
				headers: {
					Authorization: auth,
				},
			}
		)
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: "An error occurred." });
		});
});

// validation
router.post("/tokens/validation", (req, res) => {
	console.log("..............validation...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// confirmation
router.post("/tokens/confirmation", (req, res) => {
	console.log("..............confirmation...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// simulate transaction
router.get("/simulate", accessToken, (req, res) => {
	let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
	let auth = "Bearer " + req.access_token;

	axios
		.post(
			url,
			{
				ShortCode: process.env.SHORT_CODE,
				CommandID: "CustomerPayBillOnline",
				Amount: "100",
				Msisdn: "254708374149",
				BillRefNumber: "TestAPI",
			},
			{
				headers: {
					Authorization: auth,
				},
			}
		)
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: "An error occurred." });
		});
});

// timeout url
router.post("/timeout", (req, res) => {
	console.log("..............timeout...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// results for transaction
router.post("/result", (req, res) => {
	console.log("..............result...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// balance inquiry
router.get(
	"/balance",
	accessToken,
	(req, res, next) => {
		let url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query";
		let auth = "Bearer " + req.access_token;

		axios
			.post(
				url,
				{
					Initiator: process.env.INITIATOR_NAME,
					SecurityCredential: process.env.SECURITY_CREDENTIAL,
					CommandID: "AccountBalance",
					PartyA: process.env.PARTYA,
					IdentifierType: "4",
					Remarks: "Remarks",
					QueueTimeOutURL: "http://102.215.76.91/AccountBalance/queue",
					ResultURL: "http://102.215.76.91/AccountBalance/result",
				},
				{
					headers: {
						Authorization: auth,
					},
				}
			)
			.then((response) => {
				req.balanceResponse = response.data;
				next();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		res.status(200).json(req.balanceResponse);
	}
);

// stk push
router.post(
	"/stkpush",
	accessToken,
	(req, res, next) => {
		const {
			amount,
			phone,
			orderId,
			reason,
			userId,
			paymentMethod,
			deliveryMethod,
			location,
			products,
		} = req.body;
		const url =
			"https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
		const auth = "Bearer " + req.access_token;

		const date = new Date();
		const timestamp =
			date.getFullYear().toString() +
			(date.getMonth() + 1).toString().padStart(2, "0") +
			date.getDate().toString().padStart(2, "0") +
			date.getHours().toString().padStart(2, "0") +
			date.getMinutes().toString().padStart(2, "0") +
			date.getSeconds().toString().padStart(2, "0");

		const password = Buffer.from(
			process.env.BUSINESS_SHORT_CODE + process.env.PASSKEY + timestamp
		).toString("base64");

		axios
			.post(
				url,
				{
					BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
					Password: password,
					Timestamp: timestamp,
					TransactionType: "CustomerPayBillOnline",
					Amount: amount,
					PartyA: phone,
					PartyB: process.env.BUSINESS_SHORT_CODE,
					PhoneNumber: phone,
					CallBackURL: "https://90e4-102-215-76-91.ngrok-free.app/stk_callback",
					AccountReference: "Test",
					TransactionDesc: "Test",
				},
				{
					headers: {
						Authorization: auth,
					},
				}
			)
			.then((response) => {
				req.stkResponse = response.data;

				// save to db
				const newTransaction = new Transaction({
					amount,
					phone,
					reason,
					orderId,
					userId,
					paymentMethod,
					deliveryMethod,
					location,
					products,
				});

				newTransaction
					.save()
					.then((transaction) => {
						console.log(transaction);
					})
					.catch((error) => {
						console.log(error);
					});

				next();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		res.status(200).json(req.stkResponse);
	}
);

router.post("/stk_callback", (req, res) => {
	console.log("..............stk_callback...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// Handler for GET request to /api/tokens
// Fetches access token
router.get("/token", accessToken);

async function accessToken(req, res, next) {
	try {
		let url = process.env.SANDBOX_URL;
		let consumer = process.env.CONSUMER_KEY;
		let secret = process.env.SECRET_KEY;
		let auth = Buffer.from(consumer + ":" + secret).toString("base64");

		const response = await axios.get(url, {
			headers: {
				Authorization: "Basic " + auth,
			},
		});

		req.access_token = response.data.access_token;

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "An error occurred." });
	}
}

module.exports = router;
