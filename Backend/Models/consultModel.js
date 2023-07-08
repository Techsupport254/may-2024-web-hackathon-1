const mongoose = require("mongoose");

const ConsultSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	farmingType: {
		type: String,
	},
	consultType: {
		type: String,
	},
	urgency: {
		type: String,
	},
	consultDescription: {
		type: String,
	},
	professional: {
		type: String,
	},
	consultImage: {
		type: String,
	},
	status: {
		type: String,
		default: "pending",
	},
	date: {
		type: Date,
		default: Date.now,
	},
	acceptedAt: {
		type: Date,
		default: Date.now,
	},
	acceptedBy: {
		type: String,
	},
	acceptedById: {
		type: String,
	},
	amountQuoted: {
		type: Number,
	},
	settledAt: {
		type: Date,
	},
	professionalName: {
		type: String,
	},
	amountCharged: {
		type: Number,
	},
	newConsult: {
		type: Boolean,
		default: true,
	},
	refId: {
		type: String,
	},
});

module.exports = mongoose.model("Consult", ConsultSchema);
