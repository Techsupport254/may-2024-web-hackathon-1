const express = require("express");
const axios = require("axios");
require("dotenv").config();

const Payment = require("../Models/PaymentModel");
const logger = require("../Middleware/Logger");
const { sendOrderConfirmationEmail } = require("./MailRouter");
const router = express.Router();

const CartModel = require("../Models/cartModel");
const OrderModel = require("../Models/OrderModel");
const Product = require("../Models/ProductModel");

const { PAYSTACK_SECRET_KEY, CALLBACK_URL } = process.env;

router.use(express.json());

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
		deliveryFee,
		tax,
		discounts,
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
					deliveryFee: Number(deliveryFee) || 0,
					tax: Number(tax) || 0,
					discounts: discounts || [],
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
					// Calculate total amount
					let calculatedTotalAmount = 0;
					let productsAmount = 0;
					const populatedProducts = [];

					for (const product of cart.products) {
						const productDetails = await Product.findById(product.productId);
						if (!productDetails) {
							return res
								.status(400)
								.json({ message: `Product ${product.productId} not found` });
						}
						calculatedTotalAmount += productDetails.price * product.quantity;
						productsAmount += productDetails.price * product.quantity;

						populatedProducts.push({
							productId: productDetails._id,
							productName: productDetails.productName,
							quantity: product.quantity,
							status: "Pending",
							price: productDetails.price,
						});
					}

					// Apply discounts
					const discounts = paymentData.metadata.discounts || [];
					let discountAmount = 0;
					if (discounts.length > 0) {
						discounts.forEach((discount) => {
							calculatedTotalAmount -= discount.amount;
							discountAmount += discount.amount;
						});
					}

					// Apply tax
					const tax = paymentData.metadata.tax || {};
					let taxAmount = 0;
					if (tax.status) {
						taxAmount = (tax.rate / 100) * calculatedTotalAmount;
						calculatedTotalAmount += taxAmount;
						tax.amount = taxAmount; // Update tax amount in the order
					}

					// Add delivery fee
					const deliveryFee = Number(paymentData.metadata.deliveryFee) || 0;
					calculatedTotalAmount += deliveryFee;

					const order = new OrderModel({
						userId: paymentData.metadata.userId,
						orderId: reference,
						timeline: [{ type: "Confirmed", date: new Date() }],
						payment: {
							method: "Paystack",
							transactionId: paymentData.id,
							status: "Paid",
							number: paymentData.metadata.number,
							holder: paymentData.metadata.holder,
							date: new Date(paymentData.paidAt),
						},
						products: populatedProducts,
						shipping: {
							method: paymentData.metadata.shippingMethod,
							estimatedDelivery: new Date(),
						},
						billingAddress: paymentData.metadata.billingAddress,
						shippingAddress: paymentData.metadata.shippingAddress,
						amounts: {
							tax: Number(tax.amount) || 0,
							discounts: discountAmount,
							deliveryFee: deliveryFee,
							productsAmount: productsAmount,
							totalAmount: calculatedTotalAmount,
						},
					});

					await order.save();
					await CartModel.deleteOne({ userId: paymentData.metadata.userId });

					await sendOrderConfirmationEmail(paymentData.metadata.email, order);
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
