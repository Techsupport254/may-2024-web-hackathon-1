const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "product",
			},
			quantity: {
				type: Number,
				default: 1,
			},
			description: {
				type: String,
			},
			price: {
				type: Number,
			},
			image: {
				type: String,
			},
            
		},
	],
	date: {
		type: Date,
		default: Date.now,
	},
});
