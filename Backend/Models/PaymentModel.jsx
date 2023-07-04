const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
	phone: {
		type: String,
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
	userId: {
		type: String,
		required: true,
	},
	orderId: {
		type: String,
		required: true,
	},
	paymentMethod: {
		type: String,
		required: true,
	},
	deliveryMethod: {
		type: String,
		required: true,
	},
	location: {
		type: Object,
		required: true,
	},
	products: {
		type: Array,
		required: true,
	},
});

module.exports = Payment = mongoose.model("Transaction", PaymentSchema);
