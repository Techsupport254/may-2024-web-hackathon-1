const router = require("express").Router();
const Payment = require("../Models/PaymentModel");
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

// stripe payment
router.post("/stripe", async (req, res) => {
	const publicKey = process.env.STRIPE_PUBLIC_KEY;
	const secretKey = process.env.STRIPE_SECRET_KEY;
	const { amount, id } = req.body;
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "Payment for farming consultation",
			payment_method: id,
			confirm: true,
		});
		console.log("Payment", payment);
		res.json({
			message: "Payment successful",
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.json({
			message: "Payment failed",
			success: false,
		});
	}
});

module.exports = router;
