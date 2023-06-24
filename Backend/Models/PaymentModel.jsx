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
});

module.exports = Payment = mongoose.model("payment", PaymentSchema);
