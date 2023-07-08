const mongoose = require("mongoose");

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
		unqiue: true,
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
	// if farmer, farmerType is required and approximate quantity for crop farming or quantity for livestock and poultry farming
	farmingType: {
		type: String,
	},
	// if agribusiness, businessName is required and businessType is required
	businessName: {
		type: String,
	},
	businessType: {
		type: String,
	},
	businessLocation: {
		type: String,
	},
	// if agriprofessional, professionalType is required
	professionalType: {
		type: String,
	},
	// businessDescription is required for agribusiness and agriprofessional
	businessDescription: {
		type: String,
	},

	location: {
		type: String,
	},
	quantity: {
		type: Number,
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
	lastLogin: {
		type: Date,
		default: Date.now,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	sessionToken: {
		type: String,
	},
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
