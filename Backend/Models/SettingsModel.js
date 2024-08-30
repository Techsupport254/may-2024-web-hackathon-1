const mongoose = require("mongoose");

if (!mongoose.models.Settings) {
	const settingsSchema = new mongoose.Schema({
		refId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		personalizedEmails: {
			type: Boolean,
			required: true,
			default: true,
		},
		news: {
			type: Boolean,
			required: true,
			default: true,
		},
		updates: {
			type: Boolean,
			required: true,
			default: true,
		},
		reminders: {
			type: Boolean,
			required: true,
			default: true,
		},
		pushReminders: {
			type: Boolean,
			required: true,
			default: true,
		},
		pushNotifications: {
			type: Boolean,
			required: true,
			default: true,
		},
		newsLetter: {
			type: Boolean,
			required: true,
			default: true,
		},
		newProduct: {
			type: Boolean,
			required: true,
			default: true,
		},
		theme: {
			type: String,
			required: true,
			default: "light",
		},
		cookies: {
			type: Boolean,
			required: true,
			default: true,
		},
		history: {
			type: Array,
			required: true,
			default: [],
		},
	});

	settingsSchema.pre("save", function (next) {
		const settings = this;
		const modifiedPaths = settings.modifiedPaths();

		if (modifiedPaths.length > 0) {
			const changes = {};
			modifiedPaths.forEach((path) => {
				changes[path] = settings[path];
			});
			settings.history.push({
				timestamp: new Date(),
				changes,
			});
		}

		next();
	});

	mongoose.model("Settings", settingsSchema);
}

module.exports = mongoose.models.Settings;
