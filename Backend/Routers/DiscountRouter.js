const express = require("express");
const Discount = require("../Models/DiscountModel");
const { authenticateToken } = require("../Middleware/Auth");
const router = express.Router();
const product = require("../Models/ProductModel");
require("dotenv").config();

// POST route to add a discount (admin only)
router.post("/add", authenticateToken, async (req, res) => {
	try {
		const discount = new Discount(req.body);
		await discount.save();
		res.status(201).send(discount);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

// GET route to get all discounts (authenticated users)
router.get("/", authenticateToken, async (req, res) => {
	try {
		// Fetch all general discounts
		const generalDiscounts = await Discount.find();

		// Fetch products that have discounts and populate the discount information
		const productsWithDiscounts = await product.find({
			"discounts._id": { $exists: true },
		});

		// Combine general discounts and discounts embedded in products
		const discountsWithProducts = generalDiscounts.map((discount) => {
			return {
				...discount.toObject(),
				type: "General",
				products: [],
			};
		});

		// Process each product to extract its discounts and add to the list
		productsWithDiscounts.forEach((prod) => {
			prod.discounts.forEach((prodDiscount) => {
				// Check if the discount already exists in the combined list
				let existingDiscount = discountsWithProducts.find((d) =>
					d._id.equals(prodDiscount._id)
				);

				if (existingDiscount) {
					// If it exists, mark it as specific and add the product to its products array
					existingDiscount.type = "Specific";
					existingDiscount.discountImage = prod.images[0]; // Set the discount image to the first product image
					existingDiscount.products.push({
						productId: prod._id,
						productName: prod.productName,
						productImage: prod.images[0],
						productPrice: prod.price,
						refId: prod.refId,
					});
				} else {
					// If it doesn't exist, create a new discount entry
					discountsWithProducts.push({
						...prodDiscount.toObject(),
						type: "Specific",
						refId: prod.refId,
						discountImage: prod.images[0], // Set the discount image to the first product image
						products: [
							{
								productId: prod._id,
								productName: prod.productName,
								productImage: prod.images[0],
								productPrice: prod.price,
								refId: prod.refId,
							},
						],
					});
				}
			});
		});

		res.status(200).send(discountsWithProducts);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// GET route to get a discount by ID (authenticated users)
router.get("/:id", authenticateToken, async (req, res) => {
	try {
		const discount = await Discount.findById(req.params.id);
		if (!discount) {
			return res.status(404).send({ error: "Discount not found" });
		}
		res.status(200).send(discount);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// GET route to get a discount by discount code (authenticated users)
router.get("/code/:code", authenticateToken, async (req, res) => {
	try {
		const discount = await Discount.findOne({ discountCode: req.params.code });
		if (!discount) {
			return res.status(404).send({ error: "Discount not found" });
		}
		res.status(200).send(discount);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// POST route to get the status of a discount code (authenticated users)
router.post("/status/:code", authenticateToken, async (req, res) => {
	try {
		const { userId } = req.body;
		const discount = await Discount.findOne({
			discountCode: req.params.code,
		}).select("discountExpiry usedBy");
		if (!discount) {
			return res.status(404).send({ status: "Invalid" });
		}
		const currentDate = new Date();
		const expiryDate = new Date(discount.discountExpiry);
		if (currentDate > expiryDate) {
			return res.status(200).send({ status: "Expired" });
		}
		if (discount.usedBy.includes(userId)) {
			return res.status(200).send({ status: "Used" });
		}
		res.status(200).send({ status: "Active" });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// POST route to apply a discount (authenticated users)
router.post("/apply-discount", authenticateToken, async (req, res) => {
	try {
		const { userId, discountCode } = req.body;

		const discount = await Discount.findOne({ discountCode });

		if (!discount) {
			return res.status(404).send({ error: "Discount not found" });
		}

		const currentDate = new Date();
		const expiryDate = new Date(discount.discountExpiry);

		if (currentDate > expiryDate) {
			return res.status(400).send({ error: "Discount has expired" });
		}

		if (discount.usedBy.includes(userId)) {
			return res
				.status(400)
				.send({ error: "Discount code has already been used by this user" });
		}

		discount.usedBy.push(userId);
		discount.usedByTotal += 1;

		await discount.save();

		res
			.status(200)
			.send({ message: "Discount applied successfully", discount });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// GET route to get discounts by refId (authenticated users)
router.get("/user/:refId", authenticateToken, async (req, res) => {
	try {
		const discounts = await Discount.find({ refId: req.params.refId });
		if (discounts.length === 0) {
			return res.status(404).send({ error: "Discounts not found" });
		}
		res.status(200).send(discounts);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// PATCH route to update a discount by ID (admin only)
router.patch("/:id", authenticateToken, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = [
		"discountName",
		"discountPercentage",
		"discountExpiry",
		"discountDescription",
		"discountImage",
	];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: "Invalid updates" });
	}

	try {
		const discount = await Discount.findById(req.params.id);
		if (!discount) {
			return res.status(404).send({ error: "Discount not found" });
		}

		updates.forEach((update) => (discount[update] = req.body[update]));
		await discount.save();

		res.status(200).send(discount);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

// DELETE route to delete a discount by ID (admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const discount = await Discount.findByIdAndDelete(req.params.id);
		if (!discount) {
			return res.status(404).send({ error: "Discount not found" });
		}
		res.status(200).send(discount);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

// DELETE route to delete all discounts (admin only)
router.delete("/delete/all", authenticateToken, async (req, res) => {
	try {
		const result = await Discount.deleteMany();
		res.status(200).send({ message: "All discounts deleted", result });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = router;
