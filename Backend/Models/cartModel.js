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
		},
	],
});

module.exports = mongoose.model("Cart", CartSchema);
