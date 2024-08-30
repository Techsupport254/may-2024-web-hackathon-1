const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel");

// Search Products
router.get("/products", async (req, res) => {
	try {
		const { query, category, status, ownerId } = req.query;

		// Ensure ownerId is included in the search criteria
		let searchCriteria = { refId: ownerId };

		// Add query-related conditions
		if (query) {
			// Create a regular expression for partial matching
			const regex = new RegExp(query, "i"); // 'i' for case-insensitive

			// Prepare the $or condition
			searchCriteria.$or = [
				{ productName: regex },
				{ productCategory: regex },
				{ subCategory: regex },
				{ productDescription: regex },
				{ brandName: regex },
				{ labels: { $in: [regex] } },
				{ tags: { $in: [regex] } },
				{ instructions: regex },
			];
		}

		// Add category filter
		if (category && category !== "all") {
			searchCriteria.productCategory = category;
		}

		// Add status filter
		if (status && status !== "all") {
			searchCriteria.productStatus = status;
		}

		const products = await Product.find(searchCriteria);
		res.json(products);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
