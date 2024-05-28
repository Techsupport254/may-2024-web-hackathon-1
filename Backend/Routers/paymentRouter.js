const express = require("express");
const axios = require("axios");
const Payment = require("../Models/PaymentModel"); // Ensure the path is correct
require("dotenv").config();

const config = require("../Middleware/Config");
const logger = require("../Middleware/Logger");
const router = express.Router();

const { PAYSTACK_SECRET_KEY, CALLBACK_URL } = config;

router.use(express.json());
router.use(require("helmet")()); // Ensure security best practices

// POST: Initiate a payment transaction
router.post("/initiate-payment", async (req, res, next) => {
	const { email, amount } = req.body;
	if (!email || amount <= 0) {
		return res.status(400).json({ message: "Invalid email or amount" });
	}

	const reference = `ref-${Math.floor(Math.random() * 1e9)}`;

	try {
		const response = await axios.post(
			"https://api.paystack.co/transaction/initialize",
			{
				email,
				amount: Math.floor(amount * 100),
				reference,
				callback_url: CALLBACK_URL,
			},
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.data && response.data.data) {
			res.status(200).json({
				paymentUrl: response.data.data.authorization_url,
				reference,
			});
		} else {
			res.status(400).json({ message: "Unable to initiate payment" });
		}
	} catch (error) {
		logger.error("Error initiating payment:", error);
		next(error); // Pass error to error handling middleware
	}
});

// GET: Check payment status by reference
router.get("/status/:reference", async (req, res, next) => {
	const { reference } = req.params;

	try {
		const response = await axios.get(
			`https://api.paystack.co/transaction/verify/${reference}`,
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
				},
			}
		);

		if (response.data && response.data.data) {
			res.status(200).json({ status: response.data.data.status });
		} else {
			res.status(400).json({ message: "Payment status not available" });
		}
	} catch (error) {
		logger.error("Error checking payment status:", error);
		next(error); // Pass error to error handling middleware
	}
});

// Centralized error handling middleware
router.use((error, req, res, next) => {
	// Log the error for debugging
	logger.error("Unexpected error:", error);

	// Provide a generic error response to the client
	res.status(500).json({
		message: "Internal Server Error",
		error: "Unexpected error occurred",
	});
});

module.exports = router;
