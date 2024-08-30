const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const OrderModel = require("../Models/OrderModel");
const EarningsModel = require("../Models/EarningsModel");
const CartModel = require("../Models/CartModel"); // Import the CartModel to clear the cart
const UserModel = require("../Models/UserModel");
const { sendOrderConfirmationEmail } = require("./MailRouter");
const { sendPaymentNotificationEmail } = require("./PaymentNotifications");

const { PAYSTACK_SECRET_KEY, CALLBACK_URL } = process.env;

router.use(express.json());

// Function to calculate the total amounts
function calculateTotals(populatedProducts, deliveryFee, tax, discounts) {
	try {
		let productsAmount = populatedProducts.reduce(
			(total, product) => total + parseFloat(product.price) * product.quantity,
			0
		);
		let discountAmount = discounts.reduce(
			(total, discount) => total + discount.amount,
			0
		);
		let taxAmount = tax?.status
			? (tax.rate / 100) * (productsAmount - discountAmount)
			: 0;
		let totalAmount = productsAmount - discountAmount + taxAmount + deliveryFee;

		return {
			productsAmount,
			totalAmount,
			discountAmount,
			taxAmount,
			deliveryFee,
		};
	} catch (error) {
		console.error("Error calculating totals:", error.message);
		throw error;
	}
}

// Function to update earnings for product owners and send a single email listing all sold products
async function updateEarningsForProductOwners(products) {
	try {
		// Group products by their refId (userId)
		const productsByUser = products.reduce((acc, product) => {
			if (!acc[product.refId]) {
				acc[product.refId] = [];
			}
			acc[product.refId].push(product);
			return acc;
		}, {});

		// Process each user's products
		for (const [refId, userProducts] of Object.entries(productsByUser)) {
			// Fetch the user associated with the refId (_id)
			const user = await UserModel.findById(refId);

			if (!user) {
				console.error(`User with _id ${refId} not found.`);
				continue;
			}

			// Fetch or create earnings document for the owner
			let earnings = await EarningsModel.findOne({ userId: user._id });

			if (!earnings) {
				earnings = new EarningsModel({ userId: user._id });
			}

			// Variables to accumulate total gross and net earnings for this user
			let totalGrossEarnings = 0;
			let totalNetEarnings = 0;

			// Calculate earnings for each product
			for (const product of userProducts) {
				// Ensure price is correctly parsed as a number
				const productPrice = parseFloat(product.price);

				// Determine platform fee based on user role
				const platformFee = user.userType === "admin" ? 0 : productPrice * 0.1;
				const netAmount = productPrice - platformFee;

				// Accumulate earnings
				totalGrossEarnings += productPrice;
				totalNetEarnings += netAmount;

				// Add entry to earnings array
				earnings.earnings.push({
					grossAmount: productPrice,
					netAmount,
					platformFee,
					reason: "Sale of product",
					transactionType: "Credit",
				});
			}

			// Update the earnings model with accumulated amounts
			earnings.grossEarnings += totalGrossEarnings;
			earnings.netEarnings += totalNetEarnings;
			earnings.balance += totalNetEarnings;
			earnings.lastUpdated = new Date();

			// Save the updated earnings document
			await earnings.save();

			// Prepare the list of sold products
			const productList = userProducts
				.map(
					(product) =>
						`<li>${product.productName} (KSh.${product.price}) * ${product.quantity}</li>`
				)
				.join("");

			// Send a single email with all sold products listed
			await sendPaymentNotificationEmail(user.email, {
				paymentId: refId,
				amount: totalNetEarnings,
				date: new Date(),
				status: "Product Sale",
				transactionId: refId,
				holder: user.name,
				phone: user.phone,
				customMessage: `
                    <p>The following products were sold:</p>
                    <ul>${productList}</ul>
                    <p>Your gross earnings are KSh.${totalGrossEarnings.toFixed(
											2
										)}, and your net earnings after a 10% platform fee are KSh.${totalNetEarnings.toFixed(
					2
				)}.</p>
                `,
			});
		}
	} catch (error) {
		console.error("Error updating earnings:", error.message);
		throw error;
	}
}

// Function to create an order
async function createOrder(paymentData, reference, populatedProducts, totals) {
	try {
		console.log("Received metadata:", paymentData.metadata);

		// Check if the order already exists
		const existingOrder = await OrderModel.findOne({ orderId: reference });
		if (existingOrder) {
			console.log(
				"Order with this reference already exists, returning existing order."
			);
			return existingOrder; // Return the existing order to avoid duplication
		}

		if (!paymentData.metadata.holder || !paymentData.metadata.number) {
			throw new Error(
				"Customer name or phone number is missing in payment metadata."
			);
		}

		const order = new OrderModel({
			userId: paymentData.metadata.userId,
			orderId: reference,
			timeline: [{ type: "Pending", date: new Date() }],
			payment: {
				method: "Paystack",
				transactionId: paymentData.id,
				status: "Paid",
				number: paymentData.metadata.number,
				holder: paymentData.metadata.holder,
				date: new Date(paymentData.paidAt),
			},
			products: paymentData.metadata.products,
			shipping: {
				method: paymentData.metadata.shippingMethod,
				estimatedDelivery: new Date(),
			},
			billingAddress: paymentData.metadata.billingAddress,
			shippingAddress: paymentData.metadata.shippingAddress,
			discounts: paymentData.metadata.discounts || [],
			customer: {
				name: paymentData.metadata.holder,
				email: paymentData.metadata.email,
				phone: paymentData.metadata.number,
			},
			amounts: {
				productsAmount: totals.productsAmount,
				totalAmount: totals.totalAmount,
				discounts: totals.discountAmount,
				tax: totals.taxAmount,
				deliveryFee: totals.deliveryFee,
			},
		});

		// Save the order
		const savedOrder = await order.save();

		// Update earnings based on the order
		await updateEarningsForProductOwners(paymentData.metadata.products);

		// Clear the cart after successful order creation
		await CartModel.findOneAndUpdate(
			{ userId: paymentData.metadata.userId },
			{ products: [] }
		);

		// Send order confirmation email only after successfully creating the order
		await sendOrderConfirmationEmail(paymentData.metadata.email, savedOrder);

		return savedOrder;
	} catch (error) {
		console.error("Error creating order:", error.message);
		throw error;
	}
}

// Route to initiate payment
router.post("/initiate-payment", async (req, res) => {
	const {
		email,
		amount,
		userId,
		billingAddress,
		shippingAddress,
		deliveryFee,
		tax,
		discounts,
		products,
	} = req.body;

	const holder = req.body.holder || "John Doe";
	const number = req.body.number || "0700000000";

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
					shippingMethod: req.body.shippingMethod || "Standard",
					billingAddress,
					shippingAddress,
					deliveryFee: Number(deliveryFee) || 0,
					tax: Number(tax) || 0,
					discounts: discounts || [],
					holder,
					number,
					products,
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
			return res
				.status(200)
				.json({ paymentUrl: response.data.data.authorization_url, reference });
		} else {
			return res.status(400).json({ message: "Unable to initiate payment" });
		}
	} catch (error) {
		console.error("Error initiating payment:", error.message);
		return res.status(500).json({
			message: "Error initiating payment",
			error: error.response?.data || error.message,
		});
	}
});

// Route to check payment status
router.get("/status/:reference", async (req, res) => {
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
				try {
					const totals = calculateTotals(
						paymentData.metadata.products,
						Number(paymentData.metadata.deliveryFee) || 0,
						paymentData.metadata.tax || {},
						paymentData.metadata.discounts || []
					);

					const order = await createOrder(
						paymentData,
						reference,
						paymentData.metadata.products,
						totals
					);

					// Check if the order was newly created or already existed
					if (
						order.orderId === reference &&
						order._id.toString() !== paymentData.id
					) {
						// If the order is newly created, the email was already sent within createOrder
						return res
							.status(200)
							.json({
								message: "Order placed successfully",
								order,
								paymentData,
							});
					} else {
						// If the order already existed, just return the existing order details
						return res
							.status(200)
							.json({ message: "Order already exists", order, paymentData });
					}
				} catch (orderError) {
					console.error("Error placing order:", orderError.message);
					return res.status(500).json({
						message: "Order creation failed",
						error: orderError.message,
					});
				}
			} else {
				return res
					.status(400)
					.json({ message: "Payment was not successful", paymentData });
			}
		} else {
			return res.status(400).json({ message: "Payment status not available" });
		}
	} catch (error) {
		console.error("Error checking payment status:", error.message);
		return res.status(500).json({
			message: "Error checking payment status",
			error: error.response?.data || error.message,
		});
	}
});

module.exports = router;
