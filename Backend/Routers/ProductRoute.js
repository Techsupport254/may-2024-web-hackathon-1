const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel");
const { authenticateToken } = require("../Middleware/Auth");
const mongoose = require("mongoose");

// Get all products
router.get("/", authenticateToken, async (req, res) => {
	try {
		const origin = req.get("origin");
		console.log("origin", origin);

		const products = await Product.find();

		if (products.length === 0) {
			return res.status(404).json({ message: "No products found." });
		}

		if (origin === "http://localhost:5173") {
			// Apply the admin and normal user logic
			if (req.user.id === process.env.ADMIN_ID) {
				return res.json(products);
			}

			// Filter products by user id if user is not admin
			const userProducts = products.filter(
				(product) => product.refId.toString() === req.user.id
			);
			return res.json(userProducts);
		} else if (origin === "http://localhost:5174") {
			// Return all products without any filtering
			return res.json(products);
		} else {
			// Forbidden access for other origins
			return res.status(403).json({ message: "Forbidden" });
		}
	} catch (err) {
		console.error("Error fetching products:", err);
		res.status(500).json({ message: "Internal Server Error: " + err.message });
	}
});

// Get a specific product
router.get("/:productId", authenticateToken, async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId);
		res.json(product);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get products by name
router.get("/name/:productName", authenticateToken, async (req, res) => {
	try {
		const products = await Product.find({
			productName: req.params.productName,
		});
		res.json(products);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get products by category
router.get(
	"/category/:productCategory",
	authenticateToken,
	async (req, res) => {
		try {
			const products = await Product.find({
				productCategory: req.params.productCategory,
			});
			res.json(products);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
);

// Add a product
router.post("/new", authenticateToken, async (req, res) => {
	const product = new Product({
		productName: req.body.productName,
		productCategory: req.body.productCategory,
		subCategory: req.body.subCategory,
		productDescription: req.body.productDescription,
		images: req.body.images,
		brandName: req.body.brandName,
		productWeight: req.body.productWeight,
		packagingType: req.body.packagingType,
		labels: req.body.labels,
		tags: req.body.tags,
		instructions: req.body.instructions,
		price: req.body.price,
		wholesalePrice: req.body.wholesalePrice,
		wholesaleRate: req.body.wholesaleRate,
		wholesale: req.body.wholesale,
		productStatus: req.body.productStatus,
		stock: req.body.stock,
		refId: req.user._id,
	});

	try {
		const savedProduct = await product.save();
		res.json(savedProduct);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Update a product
router.patch("/:productId", authenticateToken, async (req, res) => {
	try {
		const updatedProduct = await Product.updateOne(
			{ _id: req.params.productId, refId: req.user._id }, // Ensure the user owns the product
			{
				$set: {
					productName: req.body.productName,
					productCategory: req.body.productCategory,
					subCategory: req.body.subCategory,
					productDescription: req.body.productDescription,
					images: req.body.images,
					brandName: req.body.brandName,
					productWeight: req.body.productWeight,
					packagingType: req.body.packagingType,
					labels: req.body.labels,
					tags: req.body.tags,
					instructions: req.body.instructions,
					price: req.body.price,
					wholesalePrice: req.body.wholesalePrice,
					wholesaleRate: req.body.wholesaleRate,
					wholesale: req.body.wholesale,
					productStatus: req.body.productStatus,
					stock: req.body.stock,
					discounts: req.body.discounts,
				},
			}
		);
		res.json(updatedProduct);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Add a discount to a product
router.put("/:productId/discount", authenticateToken, async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId);
		if (product && product.refId.toString() === req.user._id.toString()) {
			product.discounts.push(req.body);
			await product.save();
			res.json(product);
		} else {
			res
				.status(403)
				.json({ message: "Not authorized to add discount to this product" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get all discounts for a product
router.get("/:productId/discount", authenticateToken, async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId);
		res.json(product.discounts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get all discounts for a specific user
router.get("/discount/:userId", authenticateToken, async (req, res) => {
	try {
		const products = await Product.find({ refId: req.params.userId });
		const discounts = products.flatMap((product) => product.discounts);
		res.json(discounts);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Update a discount on a product
router.patch(
	"/:productId/discount/:discountId",
	authenticateToken,
	async (req, res) => {
		try {
			const product = await Product.findById(req.params.productId);
			if (product && product.refId.toString() === req.user._id.toString()) {
				product.discounts = product.discounts.map((discount) => {
					if (discount._id.toString() === req.params.discountId) {
						return req.body;
					}
					return discount;
				});
				await product.save();
				res.json(product);
			} else {
				res.status(403).json({
					message: "Not authorized to update discount on this product",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
);

// Remove a discount from a product
router.delete(
	"/:productId/discount/:discountId",
	authenticateToken,
	async (req, res) => {
		try {
			const product = await Product.findById(req.params.productId);
			if (product && product.refId.toString() === req.user._id.toString()) {
				product.discounts = product.discounts.filter(
					(discount) => discount._id.toString() !== req.params.discountId
				);
				await product.save();
				res.json(product);
			} else {
				res.status(403).json({
					message: "Not authorized to remove discount from this product",
				});
			}
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
);

// Delete all discounts from a product
router.delete("/:productId/discount", authenticateToken, async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId);
		if (product && product.refId.toString() === req.user._id.toString()) {
			product.discounts = [];
			await product.save();
			res.json(product);
		} else {
			res.status(403).json({
				message: "Not authorized to delete discounts from this product",
			});
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Delete a product
router.delete("/:productId", authenticateToken, async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId);
		if (product && product.refId.toString() === req.user._id.toString()) {
			await Product.deleteOne({ _id: req.params.productId });
			res.json({ message: "Product deleted successfully" });
		} else {
			res
				.status(403)
				.json({ message: "Not authorized to delete this product" });
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
