const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	location: { type: String },
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	zipCode: { type: String, required: true },
	country: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Product",
	},
	productName: { type: String, required: true },
	quantity: { type: Number, default: 1 },
	status: { type: String, default: "Pending" },
	price: { type: Number, required: true },
	refId: { type: String, required: true },
});

const timelineSchema = new mongoose.Schema({
	type: { type: String, required: true },
	date: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
	orderId: { type: String, required: true },
	timeline: [timelineSchema],
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
		trackingNumber: { type: String, required: true, default: "N/A" },
		estimatedDelivery: { type: Date },
	},
	billingAddress: addressSchema,
	shippingAddress: addressSchema,
	customer: {
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	notes: { type: String },
	discounts: [
		{
			code: { type: String },
			amount: { type: Number },
			percentage: { type: Number },
		},
	],
	tax: {
		rate: { type: Number },
		amount: { type: Number },
		status: { type: Boolean, default: false },
	},
	amounts: {
		tax: { type: Number, default: 0 },
		discounts: { type: Number, default: 0 },
		deliveryFee: { type: Number, default: 0 },
		productsAmount: { type: Number, default: 0 },
		totalAmount: { type: Number, default: 0 },
	},
	status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Order", orderSchema);
