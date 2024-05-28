// Earnings model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EarningsSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	lastUpdated: {
		type: Date,
		default: Date.now,
	},
	earnings: [
		{
			date: {
				type: Date,
				required: true,
			},
			amount: {
				type: Number,
				required: true,
			},
			reason: {
				type: String,
				required: true,
			},
			transactionType: {
				type: String,
				required: true,
				default: "Credit",
			},
		},
	],
});

module.exports = mongoose.model("Earnings", EarningsSchema);
