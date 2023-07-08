const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel");
const auth = require("../Middleware/auth");

// Handler POST requests to /cart
router.post("/", auth, async (req, res) => {
	try {
		const { userId, productId, productQty } = req.body;

		// Validation
		if (!userId || !productId) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const newProduct = new Product({
			userId,
			productId,
			productQty,
		});
		const savedProduct = await newProduct.save();
		res.json(savedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler for GET requests to /cart
router.get("/", async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler for DELETE requests to /cart/:id
router.delete("/:id", auth, async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);
		res.json(deletedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler for PATCH requests to /cart/:id
router.patch("/:id", auth, async (req, res) => {
	try {
		const { productQty } = req.body;

		// Validation
		if (!productQty) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				productQty,
			},
			{ new: true }
		);
		res.json(updatedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
