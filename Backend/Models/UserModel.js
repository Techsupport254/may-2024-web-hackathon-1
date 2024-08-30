const mongoose = require("mongoose");

if (!mongoose.models.User) {
	const UserSchema = new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		passwordHash: {
			type: String,
		},
		phone: {
			type: String,
		},
		userType: {
			type: String,
		},
		farmingType: {
			type: String,
		},
		businessName: {
			type: String,
		},
		businessType: {
			type: String,
		},
		businessLocation: {
			type: String,
		},
		professionalType: {
			type: String,
		},
		businessDescription: {
			type: String,
		},
		location: {
			type: String,
		},
		quantity: {
			type: Number,
		},
		profilePicture: {
			type: String,
		},
		paymentStatus: {
			type: String,
			default: "unpaid",
		},
		loginStatus: {
			type: String,
			default: "loggedIn",
		},
		verificationCode: {
			type: String,
		},
		verificationStatus: {
			type: String,
			default: "pending",
		},
		verificationTokenExpiry: {
			type: Date,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		created_at: {
			type: Date,
			default: Date.now,
		},
		token: {
			type: String,
		},
		settings: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Settings",
		},
	});

	const User = mongoose.model("User", UserSchema);
}

module.exports = mongoose.models.User;
