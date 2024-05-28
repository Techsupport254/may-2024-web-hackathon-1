// Earnings handler
const express = require("express");
const router = express.Router();
const EarningsModel = require("../Models/EarningsModel");

// Get all earnings
router.get("/", async (req, res) => {
	try {
		const earnings = await EarningsModel.find();
		res.json(earnings);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Get earnings by user id
router.get("/:userId", async (req, res) => {
	try {
		const earnings = await EarningsModel.find({ userId: req.params.userId });
		res.json(earnings);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Add earnings or update if they exist
router.post("/", async (req, res) => {
	const { userId, earnings } = req.body; // Assuming earnings is an array of objects

	if (!userId || !Array.isArray(earnings) || earnings.length === 0) {
		return res.status(400).json({ message: "Invalid request data" });
	}

	try {
		let existingEarnings = await EarningsModel.findOne({ userId });

		if (existingEarnings) {
			// Update earnings if they exist
			existingEarnings.earnings = existingEarnings.earnings.concat(
				earnings.map((e) => ({ ...e, date: new Date() }))
			);
			existingEarnings.lastUpdated = new Date();
			existingEarnings.totalEarnings = existingEarnings.earnings.reduce(
				(total, e) => total + e.amount,
				0
			);
			await existingEarnings.save();
			res.json(existingEarnings);
		} else {
			// Create new earnings if they don't exist
			const newEarnings = new EarningsModel({
				userId,
				lastUpdated: new Date(),
				earnings: earnings.map((e) => ({ ...e, date: new Date() })),
				totalEarnings: earnings.reduce((total, e) => total + e.amount, 0),
			});
			await newEarnings.save();
			res.json(newEarnings);
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// Update earnings by user id
router.patch("/:userId", async (req, res) => {
	const userId = req.params.userId;
	const { earnings } = req.body; // Assuming earnings is an array of objects

	if (!userId || !Array.isArray(earnings) || earnings.length === 0) {
		return res.status(400).json({ message: "Invalid request data" });
	}

	try {
		let existingEarnings = await EarningsModel.findOne({ userId });

		if (existingEarnings) {
			// Update earnings if they exist for the specific user ID
			existingEarnings.earnings = existingEarnings.earnings.concat(
				earnings.map((e) => ({
					...e,
					date: new Date(),
					reason: `${e.quantity} ${e.productId} sold`,
				}))
			);
			existingEarnings.totalEarnings = existingEarnings.earnings.reduce(
				(total, e) => total + e.amount,
				0
			);
			await existingEarnings.save();
			res.json(existingEarnings);
		} else {
			// Create new earnings if they don't exist
			const totalAmount = earnings.reduce((total, e) => total + e.amount, 0);
			const newEarnings = new EarningsModel({
				userId,
				lastUpdated: new Date(),
				earnings: earnings.map((e) => ({
					...e,
					date: new Date(),
					reason: `${e.quantity} ${e.productId} sold`,
				})),
				totalEarnings: totalAmount,
			});
			await newEarnings.save();
			res.json(newEarnings);
		}
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
