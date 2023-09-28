const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel");

// Get all products
router.get("/", async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (err) {
		res.json({ message: err });
	}
});

// Get a specific product
router.get("/:productId", async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId);
		res.json(product);
	} catch (err) {
		res.json({ message: err });
	}
});

// get products by name
router.get("/name/:productName", async (req, res) => {
	try {
		const products = await Product.find({ name: req.params.productName });
		res.json(products);
	} catch (err) {
		res.json({ message: err });
	}
});

// get products by category
router.get("/category/:productCategory", async (req, res) => {
	try {
		const products = await Product.find({
			category: req.params.productCategory,
		});
		res.json(products);
	} catch (err) {
		res.json({ message: err });
	}
});

// Add a product
router.post("/new", async (req, res) => {
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
		refId: req.body.refId,
	});

	try {
		const savedProduct = await product.save();
		res.json(savedProduct);
	} catch (err) {
		res.json({ message: err });
	}
});

// update a product
router.patch("/:productId", async (req, res) => {
	try {
		const updatedProduct = await Product.updateOne(
			{ _id: req.params.productId },
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
				},
			}
		);
		res.json(updatedProduct);
	} catch (err) {
		res.json({ message: err });
	}
});

// delete a product
router.delete("/:productId", async (req, res) => {
	try {
		const removedProduct = await Product.remove({ _id: req.params.productId });
		res.json(removedProduct);
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
