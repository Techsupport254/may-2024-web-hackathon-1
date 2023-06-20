const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel.jsx");
const auth = require("../Middleware/auth.jsx");

// Handler for GET requests to /products
router.get("/", async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler for POST requests to /products
router.post("/", auth, async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		// Validation
		if (!name || !description || !price || !image || !category) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const newProduct = new Product({
			name,
			description,
			price,
			image,
			category,
		});
		const savedProduct = await newProduct.save();
		res.json(savedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler for DELETE requests to /products/:id
router.delete("/:id", auth, async (req, res) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(req.params.id);
		res.json(deletedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Handler for PATCH requests to /products/:id
router.patch("/:id", auth, async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		// Validation
		if (!name || !description || !price || !image || !category) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			{
				name,
				description,
				price,
				image,
				category,
			},
			{ new: true }
		);
		res.json(updatedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
