const router = require("express").Router();
const Payment = require("../Models/PaymentModel.jsx");
const axios = require("axios");


// Handler for POST request to /api/payment
// Creates a new payment
router.post("/stk", async (req, res) => {
	const { phone, amount, reason } = req.body;
	try {
		// Create a new payment
		const newPayment = new Payment({
			phone,
			amount,
			reason,
		});

		// Save the payment to the database
		const savedPayment = await newPayment.save();
		res.status(200).json(savedPayment);
	} catch (err) {
		res.status(400).json({
			message: "Error creating payment",
			error: err,
		});
	}
});

// Handler for GET request to /api/payment
// Fetches payment data
router.get("/payment", async (req, res) => {
	try {
		// Fetch the payment data from the database
		const payments = await Payment.find();
		res.status(200).json(payments);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching payment data",
			error: err,
		});
	}
});

// Handler for GET request to /api/payment/:id
// Fetches payment data by id
router.get("/payment/:id", async (req, res) => {
	try {
		// Fetch the payment data from the database
		const payment = await Payment.findById(req.params.id);
		res.status(200).json(payment);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching payment data",
			error: err,
		});
	}
});

module.exports = router;
