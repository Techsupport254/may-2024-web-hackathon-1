const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Settings = require("../models/SettingsModel");
const { check, validationResult } = require("express-validator");

// Middleware for handling validation errors
const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Validation checks
const settingsValidation = [
	check("personalizedEmails", "Personalized Emails is required")
		.optional()
		.isBoolean(),
	check("news", "News is required").optional().isBoolean(),
	check("updates", "Updates is required").optional().isBoolean(),
	check("reminders", "Reminders is required").optional().isBoolean(),
	check("pushReminders", "Push Reminders is required").optional().isBoolean(),
	check("pushNotifications", "Push Notifications is required")
		.optional()
		.isBoolean(),
	check("newsLetter", "News Letter is required").optional().isBoolean(),
	check("newProduct", "New Product is required").optional().isBoolean(),
	check("theme", "Theme is required").optional().not().isEmpty(),
	check("cookies", "Cookies is required").optional().isBoolean(),
];

router.get("/", async (req, res) => {
	try {
		const users = await User.find().populate("settings");
		res.json(users.map((user) => user.settings));
	} catch (err) {
		res.status(500).send("Server Error");
	}
});

// GET by refId
router.get("/:userId", async (req, res) => {
	try {
		const settings = await Settings.findOne({ refId: req.params.userId });
		if (!settings) {
			return res.status(404).json({ msg: "Settings not found" });
		}
		res.json(settings);
	} catch (err) {
		res.status(500).send("Server Error");
	}
});

router.post(
	"/:userId",
	settingsValidation,
	handleValidationErrors,
	async (req, res) => {
		const { userId } = req.params;
		const {
			personalizedEmails,
			news,
			updates,
			reminders,
			pushReminders,
			pushNotifications,
			newsLetter,
			newProduct,
			theme,
			cookies,
		} = req.body;

		try {
			const user = await User.findById(userId);
			if (!user) {
				return res.status(404).json({ msg: "User not found" });
			}

			const newSettings = new Settings({
				refId: user._id,
				personalizedEmails,
				news,
				updates,
				reminders,
				pushReminders,
				pushNotifications,
				newsLetter,
				newProduct,
				theme,
				cookies,
			});

			await newSettings.save();
			user.settings = newSettings._id;
			await user.save();

			res.json(newSettings);
		} catch (err) {
			res.status(500).send("Server Error");
		}
	}
);

// Update one or more fields
router.patch(
	"/:userId",
	settingsValidation,
	handleValidationErrors,
	async (req, res) => {
		const { userId } = req.params;

		try {
			let settings = await Settings.findOne({ refId: userId });

			if (!settings) return res.status(404).json({ msg: "Settings not found" });

			// Update only the fields that are present in the request body
			Object.keys(req.body).forEach((key) => {
				settings[key] = req.body[key];
			});

			await settings.save();

			res.json(settings);
		} catch (err) {
			res.status(500).send("Server Error");
		}
	}
);

router.delete("/:userId", async (req, res) => {
	try {
		let settings = await Settings.findOne({ refId: req.params.userId });

		if (!settings) return res.status(404).json({ msg: "Settings not found" });

		await Settings.findByIdAndRemove(settings._id);

		res.json({ msg: "Settings removed" });
	} catch (err) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
