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
			quantity: {
				type: Number,
				default: 1,
			},
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

module.exports = mongoose.model("Cart", CartSchema);
