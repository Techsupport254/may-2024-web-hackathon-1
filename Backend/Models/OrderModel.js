const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
	country: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
	productId: { type: String, required: true },
	productName: { type: String, required: true },
	quantity: { type: Number, default: 1 },
	status: { type: String, default: "Pending" },
});

const orderSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	orderId: { type: String, required: true },
	status: { type: String, default: "Pending" },
	payment: {
		method: { type: String, required: true },
		transactionId: { type: String, required: true },
		status: { type: String, default: "Pending" },
		number: { type: String, required: true, default: "0700000000" },
		holder: { type: String, required: true, default: "John Doe" },
		date: { type: Date, default: Date.now },
	},
	date: { type: Date, default: Date.now },
	products: [productSchema],
	shipping: {
		method: { type: String, required: true },
		trackingNumber: { type: String, required: true },
		estimatedDelivery: { type: Date },
	},
	billingAddress: addressSchema,
	shippingAddress: addressSchema,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	notes: { type: String },
	discounts: [
		{
			code: { type: String },
			amount: { type: Number },
		},
	],
	tax: {
		rate: { type: Number },
		amount: { type: Number },
		status: { type: Boolean, default: false },
	},
});

module.exports = mongoose.model("Order", orderSchema);
