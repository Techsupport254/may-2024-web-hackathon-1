const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
	{
		productName: {
			type: String,
			required: true,
		},
		productCategory: {
			type: String,
			required: true,
		},
		subCategory: {
			type: String,
			required: true,
		},
		productDescription: {
			type: String,
			required: true,
		},
		images: {
			type: Array,
			required: true,
		},
		brandName: {
			type: String,
			required: true,
		},
		productWeight: {
			type: String,
			required: true,
		},
		packagingType: {
			type: String,
			required: true,
		},
		labels: {
			type: Array,
			required: true,
		},
		tags: {
			type: Array,
			required: true,
		},
		instructions: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		wholesalePrice: {
			type: Number,
			required: true,
		},
		wholesaleRate: {
			type: Number,
			required: true,
		},
		wholesale: {
			type: Boolean,
		},
		stock: {
			type: Number,
			required: true,
		},
		productStatus: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("agrisolveProduct", ProductSchema);
