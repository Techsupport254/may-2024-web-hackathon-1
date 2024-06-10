const express = require("express");
const router = express.Router();
const Cart = require("../Models/cartModel");

// Add or update product in cart
router.post("/", async (req, res) => {
	try {
		const { userId, productId, productName, quantity } = req.body;

		// Validation
		if (
			!userId ||
			!productId ||
			!productName ||
			quantity === undefined ||
			isNaN(quantity) ||
			quantity < 1
		) {
			return res.status(400).json({
				message:
					"Invalid request: Provide valid userId, productId, productName, and non-negative quantity",
			});
		}

		let userCart = await Cart.findOne({ userId });

		if (!userCart) {
			// Create a new cart if none exists
			userCart = new Cart({
				userId,
				products: [{ productId, productName, quantity }],
			});
		} else {
			// Check if the product is already in the cart
			const existingProduct = userCart.products.find(
				(p) => p.productId === productId
			);
			if (existingProduct) {
				// If product exists, update its quantity
				existingProduct.quantity += quantity;
			} else {
				// If product does not exist, add it to the cart
				userCart.products.push({ productId, productName, quantity });
			}
		}

		await userCart.save();

		res.json({ message: "Cart updated successfully", cart: userCart });
	} catch (err) {
		res
			.status(500)
			.json({ error: "Internal Server Error", details: err.message });
	}
});

// Get cart by userId
router.get("/:userId", async (req, res) => {
	try {
		const userId = req.params.userId;
		const userCart = await Cart.findOne({ userId });

		if (!userCart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.json(userCart);
	} catch (err) {
		res
			.status(500)
			.json({ error: "Internal Server Error", details: err.message });
	}
});

// Remove product from cart
router.delete("/:userId/:productId", async (req, res) => {
	try {
		const { userId, productId } = req.params;

		let userCart = await Cart.findOne({ userId });
		if (!userCart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		// Check if the product exists in the cart
		const existingProductIndex = userCart.products.findIndex(
			(p) => p.productId === productId
		);
		if (existingProductIndex === -1) {
			return res.status(404).json({ message: "Product not found in the cart" });
		}

		// Remove the product from the cart
		userCart.products.splice(existingProductIndex, 1);

		if (userCart.products.length === 0) {
			// Remove cart if no products remain
			await Cart.deleteOne({ userId });
			return res.json({ message: "Cart is empty and has been deleted" });
		} else {
			await userCart.save();
			return res.json({ message: "Product removed from cart", cart: userCart });
		}
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Internal Server Error", details: err.message });
	}
});

// Patch endpoint to set quantity of existing products in the cart
router.patch("/:userId/:productId", async (req, res) => {
	try {
		const { userId, productId } = req.params;
		let { quantity } = req.body;

		// Validation
		if (!quantity || isNaN(quantity)) {
			return res.status(400).json({
				message: "Invalid quantity: Provide a valid number",
			});
		}

		const userCart = await Cart.findOne({ userId });

		if (!userCart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		const product = userCart.products.find((p) => p.productId === productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found in the cart" });
		}

		// Set the quantity to the provided value
		product.quantity = parseInt(quantity);

		if (product.quantity <= 0) {
			// Remove the product if the quantity becomes zero or negative
			userCart.products = userCart.products.filter(
				(p) => p.productId !== productId
			);
		}

		if (userCart.products.length === 0) {
			await userCart.remove(); // Remove cart if no products remain
			return res.json({ message: "Cart is empty and has been deleted" });
		}

		await userCart.save();

		res.json({ message: "Quantity updated successfully", cart: userCart });
	} catch (err) {
		res
			.status(500)
			.json({ error: "Internal Server Error", details: err.message });
	}
});

// DELETE endpoint to clear all the carts
router.delete("/", async (req, res) => {
	try {
		await Cart.deleteMany({});
		res.json({ message: "All carts have been cleared" });
	} catch (err) {
		res
			.status(500)
			.json({ error: "Internal Server Error", details: err.message });
	}
});

module.exports = router;
