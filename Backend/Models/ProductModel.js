const mongoose = require("mongoose");

const DiscountSchema = mongoose.Schema(
	{
		discountName: {
			type: String,
			required: true,
		},
		discountCode: {
			type: String,
			required: true,
			unique: true,
		},
		discountPercentage: {
			type: Number,
			required: true,
		},
		discountAmount: {
			type: Number,
			required: true,
		},
		discountExpiry: {
			type: Date,
			required: true,
		},
		discountDescription: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

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
		ratings: [
			{
				rating: {
					type: Number,
					default: 0,
				},
				comment: {
					type: String,
					default: "No comment",
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			},
		],
		productStatus: {
			type: String,
			required: true,
		},
		refId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},

		discounts: [DiscountSchema],
	},
	{
		timestamps: true,
	}
);

ProductSchema.index({
	productName: "text",
	productCategory: "text",
	subCategory: "text",
	productDescription: "text",
	brandName: "text",
	labels: "text",
	tags: "text",
	instructions: "text",
});

module.exports = mongoose.model("agrisolveProduct", ProductSchema);
