const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");

// Handler POST requests to /order
router.post("/", async (req, res) => {
	try {
		const { userId, products, orderId, status, payment } = req.body;

		// Validation
		if (!userId || !products || !orderId || !payment) {
			return res
				.status(400)
				.json({ message: "Please enter all required fields" });
		}

		// Create an array of product objects
		const productObjects = products.map((product) => ({
			userId: product.userId,
			ownerId: product.ownerId,
			productId: product.productId,
			quantity: product.quantity,
		}));

		// Create the order with multiple products
		const userOrder = new Order({
			userId,
			orderId,
			status,
			payment,
			products: productObjects,
		});

		const savedOrderProduct = await userOrder.save();
		res.json({ message: "Products added to order", order: savedOrderProduct });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler GET requests to /order
router.get("/", async (req, res) => {
	try {
		const orders = await Order.find();
		res.json(orders);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler GET requests to /order/:userId
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		// Validation
		if (!id) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		// Check if the user already has an order
		const userOrder = await Order.findOne({
			$or: [{ userId: id }, { ownerId: id }],
		});

		if (!userOrder) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json({ order: userOrder });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
