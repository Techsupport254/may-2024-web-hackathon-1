const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/ProductModel");

// POST: Create a new order and clear the cart
router.post("/", async (req, res) => {
	const {
		userId,
		orderId,
		timeline,
		payment,
		products,
		shipping,
		billingAddress,
		shippingAddress,
		notes,
		discounts,
		tax,
		deliveryFee,
	} = req.body;

	if (!userId || !products || products.length === 0 || !orderId || !payment) {
		return res
			.status(400)
			.json({ message: "Missing required fields or no products provided." });
	}

	try {
		// Calculate total amount
		let calculatedTotalAmount = 0;
		let productsAmount = 0;
		const productObjects = [];

		for (const product of products) {
			const productDetails = await Product.findById(product.productId);
			if (!productDetails) {
				return res
					.status(400)
					.json({ message: `Product ${product.productId} not found` });
			}
			calculatedTotalAmount += productDetails.price * product.quantity;
			productsAmount += productDetails.price * product.quantity;

			productObjects.push({
				productId: productDetails._id,
				productName: productDetails.name,
				quantity: product.quantity,
				status: product.status,
				price: productDetails.price,
			});
		}

		// Apply discounts
		let discountAmount = 0;
		if (discounts && discounts.length > 0) {
			discounts.forEach((discount) => {
				calculatedTotalAmount -= discount.amount;
				discountAmount += discount.amount;
			});
		}

		// Apply tax
		let taxAmount = 0;
		if (tax && tax.status) {
			taxAmount = (tax.rate / 100) * calculatedTotalAmount;
			calculatedTotalAmount += taxAmount;
			tax.amount = taxAmount; // Update tax amount in the order
		}

		// Add delivery fee
		calculatedTotalAmount += Number(deliveryFee) || 0;

		const newOrder = new Order({
			userId,
			orderId,
			timeline,
			payment,
			products: productObjects,
			shipping,
			billingAddress,
			shippingAddress,
			totalAmount: calculatedTotalAmount,
			notes,
			discounts,
			tax,
			deliveryFee,
			amounts: {
				tax: Number(taxAmount) || 0,
				discounts: Number(discountAmount) || 0,
				deliveryFee: Number(deliveryFee) || 0,
				productsAmount: Number(productsAmount) || 0,
				totalAmount: calculatedTotalAmount,
			},
		});

		const savedOrder = await newOrder.save();
		await Cart.deleteOne({ userId }); // Clear the cart after saving the order
		res.status(201).json({
			message: "Order created and cart cleared successfully!",
			order: savedOrder,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET: Retrieve all orders
router.get("/", async (req, res) => {
	try {
		const orders = await Order.find();
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET: Retrieve order by orderId
router.get("/:orderId", async (req, res) => {
	const { orderId } = req.params;
	try {
		const order = await Order.findOne({ orderId });
		if (!order) {
			return res.status(404).json({ message: "Order not found." });
		}
		res.json(order);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET: Retrieve all orders by userId
router.get("/user/:userId", async (req, res) => {
	const { userId } = req.params;
	try {
		const orders = await Order.find({ userId });
		if (orders.length === 0) {
			return res
				.status(404)
				.json({ message: "No orders found for this user." });
		}
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET: Retrieve all orders by ownerId
router.get("/owner/:ownerId", async (req, res) => {
	const { ownerId } = req.params;
	try {
		const orders = await Order.find().populate({
			path: "products.productId",
			model: "Product", // Ensure this matches your Product model registration
		});

		const filteredOrders = orders
			.filter((order) =>
				order.products.some(
					(product) => product.productId && product.productId.refId === ownerId
				)
			)
			.map((order) => ({
				...order.toObject(),
				products: order.products.filter(
					(product) => product.productId && product.productId.refId === ownerId
				),
			}));

		if (filteredOrders.length === 0) {
			return res.status(404).json({
				message: "No orders found containing products from this owner.",
			});
		}
		res.json(filteredOrders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// PUT: Update order status by orderId
router.put("/:orderId/status", async (req, res) => {
	const { orderId } = req.params;
	const { status } = req.body;

	try {
		const order = await Order.findOne({ orderId });
		if (!order) {
			return res.status(404).json({ message: "Order not found." });
		}

		order.timeline.push({ type: status, date: new Date() });
		order.updatedAt = new Date();

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// DELETE: Delete an order by orderId
router.delete("/:orderId", async (req, res) => {
	const { orderId } = req.params;
	try {
		const removedOrder = await Order.deleteOne({ orderId });
		res.json(removedOrder);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// DELETE: Delete all orders
router.delete("/", async (req, res) => {
	try {
		const removedOrders = await Order.deleteMany();
		res.json(removedOrders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
