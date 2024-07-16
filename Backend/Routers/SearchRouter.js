const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel");

// Search Products
router.get("/products", async (req, res) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.status(400).json({ message: "Query parameter is required" });
		}

		// Create a regular expression for partial matching
		const regex = new RegExp(query, "i"); // 'i' for case-insensitive

		const products = await Product.find({
			$or: [
				{ productName: regex },
				{ productCategory: regex },
				{ subCategory: regex },
				{ productDescription: regex },
				{ brandName: regex },
				{ labels: { $in: [regex] } },
				{ tags: { $in: [regex] } },
				{ instructions: regex },
			],
		});

		res.json(products);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
