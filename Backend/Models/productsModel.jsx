const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	price: {
		type: Number,
	},
	images: {
        type: Array,
        
	},
	category: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
