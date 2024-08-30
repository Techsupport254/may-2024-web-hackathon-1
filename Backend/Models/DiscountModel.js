const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
	discountName: {
		type: String,
		required: true,
	},
	discountCode: {
		type: String,
		required: true,
		unique: true,
	},
	discountPercentage: {
		type: Number,
		required: true,
	},
	discountExpiry: {
		type: Date,
		required: true,
	},
	discountDescription: {
		type: String,
	},
	discountImage: {
		type: String,
	},
	refId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	usedBy: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	usedByTotal: {
		type: Number,
		default: 0,
	},
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
