const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	products: [
		{
			productId: {
				type: String,
				required: true,
			},
			productName: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
			price: {
				type: Number,
				required: true,
			},
			date: {
				type: Date,
				default: Date.now,
			},
			refId: {
				type: String,
				required: true,
			},
		},
	],
});

// Use existing model if it exists, otherwise create a new one
module.exports = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
