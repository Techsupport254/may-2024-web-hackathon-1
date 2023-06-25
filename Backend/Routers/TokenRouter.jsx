const axios = require("axios");
const router = require("express").Router();

// register url
router.get("/register", accessToken, (req, res) => {
	let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
	let auth = "Bearer " + req.access_token;

	axios
		.post(
			url,
			{
				ShortCode: process.env.SHORT_CODE,
				ResponseType: "Completed",
				ConfirmationURL: "http://102.215.76.91/confirmation",
				ValidationURL: "http://102.215.76.91/validation",
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
router.post("/validation", (req, res) => {
	console.log("..............validation...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// confirmation
router.post("/confirmation", (req, res) => {
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
				// Don't return response.data here, instead call the next middleware
				req.balanceResponse = response.data;
				next();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		// Use the response from the previous middleware to return the balance result
		res.status(200).json(req.balanceResponse);
	}
);

// stk push
router.get(
	"/stkpush",
	accessToken,
	(req, res, next) => {
		let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
		let auth = "Bearer " + req.access_token;

		let date = new Date();
		const timestamp =
			date.getFullYear().toString() +
			(date.getMonth() + 1).toString().padStart(2, "0") +
			date.getDate().toString().padStart(2, "0") +
			date.getHours().toString().padStart(2, "0") +
			date.getMinutes().toString().padStart(2, "0") +
			date.getSeconds().toString().padStart(2, "0");

		const Password = Buffer.from(
			"174379" + process.env.PASSKEY + timestamp
		).toString("base64");

		axios
			.post(
				url,
				{
					BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
					Password: Password,
					Timestamp: timestamp,
					TransactionType: "CustomerPayBillOnline",
					Amount: "1",
					PartyA: "254716404137",
					PartyB: process.env.BUSINESS_SHORT_CODE,
					PhoneNumber: "254716404137",
					CallBackURL: "http://102.215.76.91/stk_callback",
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
				// Don't return response.data here, instead call the next middleware
				req.stkResponse = response.data;
				next();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		// Use the response from the previous middleware to return the stk push result
		res.status(200).json(req.stkResponse);
	}
);

router.post("/stk_callback", (req, res) => {
	console.log("..............stk_callback...............");
	console.log(req.body);
	res.status(200).json(req.body);
});

// stk push query
router.get(
	"/stkpushquery",
	accessToken,
	(req, res, next) => {
		let url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
		let auth = "Bearer " + req.access_token;

		axios
			.post(
				url,
				{
					BusinessShortCode: process.env.BUSINESS_SHORT_CODE,
					Password: process.env.PASSWORD,
					Timestamp: process.env.TIMESTAMP,
					CheckoutRequestID: "ws_CO_27112017183829662",
				},
				{
					headers: {
						Authorization: auth,
					},
				}
			)
			.then((response) => {
				// Don't return response.data here, instead call the next middleware
				req.stkQueryResponse = response.data;
				next();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		// Use the response from the previous middleware to return the stk push query result
		res.status(200).json(req.stkQueryResponse);
	}
);

// c2b register
router.get(
	"/c2bregister",
	accessToken,
	(req, res, next) => {
		let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
		let auth = "Bearer " + req.access_token;

		axios
			.post(
				url,
				{
					ShortCode: process.env.BUSINESS_SHORT_CODE,
					ResponseType: "Completed",
					ConfirmationURL: "",
					ValidationURL: "",
				},
				{
					headers: {
						Authorization: auth,
					},
				}
			)
			.then((response) => {
				// Don't return response.data here, instead call the next middleware
				req.c2bRegisterResponse = response.data;
				next();
			})
			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		// Use the response from the previous middleware to return the c2b register result
		res.status(200).json(req.c2bRegisterResponse);
	}
);

// c2b simulate
router.get(
	"/c2bsimulate",
	accessToken,
	(req, res, next) => {
		let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate";
		let auth = "Bearer " + req.access_token;

		axios
			.post(
				url,
				{
					ShortCode: process.env.BUSINESS_SHORT_CODE,
					CommandID: "CustomerPayBillOnline",
					Amount: "1",
					Msisdn: process.env.PARTYA,
					BillRefNumber: "Test",
				},
				{
					headers: {
						Authorization: auth,
					},
				}
			)

			.then((response) => {
				// Don't return response.data here, instead call the next middleware
				req.c2bSimulateResponse = response.data;
				next();
			})

			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		// Use the response from the previous middleware to return the c2b simulate result
		res.status(200).json(req.c2bSimulateResponse);
	}
);

// b2c payment request
router.get(
	"/b2c",
	accessToken,
	(req, res, next) => {
		let url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
		let auth = "Bearer " + req.access_token;

		axios
			.post(
				url,
				{
					InitiatorName: process.env.INITIATOR_NAME,
					SecurityCredential: process.env.SECURITY_CREDENTIAL,
					CommandID: "BusinessPayment",
					Amount: "100",
					PartyA: process.env.PARTYA,
					PartyB: process.env.PARTYB,
					Remarks: "Testing",
					QueueTimeOutURL: "",
					ResultURL: "",
					Occasion: "",
				},
				{
					headers: {
						Authorization: auth,
					},
				}
			)
			.then((response) => {
				// Don't return response.data here, instead call the next middleware
				req.b2cResponse = response.data;
				next();
			})

			.catch((error) => {
				console.log(error);
				res.status(500).json({ error: "An error occurred." });
			});
	},
	(req, res) => {
		// Use the response from the previous middleware to return the b2c result
		res.status(200).json(req.b2cResponse);
	}
);

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

		// Call the next middleware
		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "An error occurred." });
	}
}

module.exports = router;
