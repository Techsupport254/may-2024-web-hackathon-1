const express = require("express");
const axios = require("axios");
require("dotenv").config();

const Payment = require("../Models/PaymentModel");
const config = require("../Middleware/Config");
const logger = require("../Middleware/Logger");
const helmet = require("helmet");
const { sendOrderConfirmationEmail } = require("./MailRouter");
const router = express.Router();

const CartModel = require("../Models/cartModel");
const OrderModel = require("../Models/OrderModel");

const { PAYSTACK_SECRET_KEY, CALLBACK_URL } = process.env;

router.use(express.json());
router.use(helmet());

// POST: Initiate a payment transaction
router.post("/initiate-payment", async (req, res, next) => {
	const {
		email,
		amount,
		userId,
		number,
		holder,
		shippingMethod,
		billingAddress,
		shippingAddress,
	} = req.body;

	if (!email || amount <= 0 || !userId || !billingAddress || !shippingAddress) {
		return res
			.status(400)
			.json({ message: "Invalid email, amount, or address details" });
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
				metadata: {
					userId,
					email,
					number: number || "0700000000",
					holder: holder || "John Doe",
					shippingMethod: shippingMethod || "Standard",
					billingAddress,
					shippingAddress,
				},
			},
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.data && response.data.data) {
			return res.status(200).json({
				paymentUrl: response.data.data.authorization_url,
				reference,
				...response.data.data,
			});
		} else {
			return res.status(400).json({ message: "Unable to initiate payment" });
		}
	} catch (error) {
		logger.error("Error initiating payment:", error);
		if (error.response) {
			return res.status(error.response.status).json({
				message: "Error initiating payment",
				error: error.response.data,
			});
		} else if (error.request) {
			return res
				.status(500)
				.json({ message: "No response from payment gateway" });
		} else {
			return res.status(500).json({ message: "Internal Server Error" });
		}
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
			const paymentData = response.data.data;

			if (paymentData.status === "success") {
				const cart = await CartModel.findOne({
					userId: paymentData.metadata.userId,
				}).populate("products.productId");

				if (cart) {
					const order = new OrderModel({
						userId: paymentData.metadata.userId,
						orderId: reference,
						status: "Completed",
						payment: {
							method: "Paystack",
							transactionId: paymentData.id,
							status: "Completed",
							number: paymentData.metadata.number,
							holder: paymentData.metadata.holder,
							date: new Date(paymentData.paidAt),
						},
						products: cart.products,
						shipping: {
							method: paymentData.metadata.shippingMethod,
							trackingNumber: "N/A",
							estimatedDelivery: new Date(),
						},
						billingAddress: paymentData.metadata.billingAddress,
						shippingAddress: paymentData.metadata.shippingAddress,
					});

					await order.save();
					await CartModel.deleteOne({ userId: paymentData.metadata.userId });

					await sendOrderConfirmationEmail(
						paymentData.metadata.email,
						cart.products,
						order
					);
				}
			}

			return res.status(200).json(paymentData);
		} else {
			return res.status(400).json({ message: "Payment status not available" });
		}
	} catch (error) {
		logger.error("Error checking payment status:", error);
		if (error.response) {
			return res.status(error.response.status).json({
				message: "Error checking payment status",
				error: error.response.data,
			});
		} else if (error.request) {
			return res
				.status(500)
				.json({ message: "No response from payment gateway" });
		} else {
			return res.status(500).json({ message: "Internal Server Error" });
		}
	}
});

// Centralized error handling middleware
router.use((error, req, res, next) => {
	logger.error("Unexpected error:", error);
	res.status(500).json({
		message: "Internal Server Error",
		error: error.message,
	});
});

module.exports = router;
