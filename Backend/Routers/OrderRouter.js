const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");
const Cart = require("../Models/cartModel");
const Product = require("../Models/ProductModel"); // Assuming this is correctly set up now

// POST: Create a new order and clear the cart
router.post("/", async (req, res) => {
	const {
		userId,
		orderId,
		status,
		payment,
		products,
		shipping,
		billingAddress,
		shippingAddress,
		totalAmount,
		notes,
		discounts,
		tax,
	} = req.body;

	if (!userId || !products || products.length === 0 || !orderId || !payment) {
		return res
			.status(400)
			.json({ message: "Missing required fields or no products provided." });
	}

	try {
		const productObjects = products.map((product) => ({
			productId: product.productId,
			productName: product.productName,
			quantity: product.quantity,
			status: product.status,
		}));

		const newOrder = new Order({
			userId,
			orderId,
			status,
			payment,
			products: productObjects,
			shipping,
			billingAddress,
			shippingAddress,
			totalAmount,
			notes,
			discounts,
			tax,
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
			model: "agrisolveProduct", // Ensure this matches your Product model registration
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
