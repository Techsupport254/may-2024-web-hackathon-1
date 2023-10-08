const express = require("express");
const router = express.Router();
const Product = require("../Models/cartModel");

// Handler POST requests to /cart
router.post("/", async (req, res) => {
	try {
		const { userId, productId } = req.body;

		// Validation
		if (!userId || !productId) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		// Check if the user already has a cart
		let userCart = await Product.findOne({ userId });

		if (!userCart) {
			// If no cart, create a new one
			userCart = new Product({
				userId,
				products: [
					{
						productId,
					},
				],
			});
		} else {
			// If cart exists, add the new product
			userCart.products.push({
				productId,
			});
		}

		const savedCartProduct = await userCart.save();
		res.json({ message: "Product added to cart", cart: savedCartProduct });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler GET requests to /cart/:userId
router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		// Validation
		if (!userId) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		// Check if the user already has a cart
		const userCart = await Product.findOne({ userId });

		if (!userCart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.json({ cart: userCart });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler DELETE requests to /cart
router.delete("/", async (req, res) => {
	try {
		const { userId, productId } = req.body;

		// Validation
		if (!userId || !productId) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		// Check if the user already has a cart
		const userCart = await Product.findOne({ userId });

		if (!userCart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		// Remove the product from the cart
		userCart.products = userCart.products.filter(
			(product) => product.productId !== productId
		);

		const savedCartProduct = await userCart.save();
		res.json({ message: "Product removed from cart", cart: savedCartProduct });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
