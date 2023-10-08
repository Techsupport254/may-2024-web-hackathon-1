const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	orderId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "Pending",
	},
	payment: {
		type: String,
		default: "Pending",
	},
	date: {
		type: Date,
		default: Date.now,
	},
	products: [
		{
			ownerId: {
				type: String,
				required: true,
			},
			productId: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
		},
	],
});

module.exports = mongoose.model("Order", OrderSchema);
