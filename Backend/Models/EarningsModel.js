const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for individual earnings entries
const earningsEntrySchema = new Schema(
	{
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		grossAmount: {
			type: Number,
			required: true,
		},
		netAmount: {
			type: Number,
			required: true,
		},
		platformFee: {
			type: Number,
			default: 0,
		},
		reason: {
			type: String,
			required: true,
			enum: ["Sale of product", "Refund", "Commission", "Bonus", "Adjustment"],
		},
		transactionType: {
			type: String,
			required: true,
			enum: ["Credit", "Debit"],
		},
		status: {
			type: String,
			enum: ["Earned", "Pending", "Confirmed", "Disputed", "Adjusted"],
			default: "Earned",
		},
		currency: {
			type: String,
			default: "KES", // Default to Kenyan Shilling
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

// Schema for payment flags
const paymentFlagsSchema = new Schema(
	{
		type: {
			type: String,
			enum: [
				"Overdue",
				"Underpaid",
				"Overpaid",
				"Flagged",
				"Requested",
				"Paid",
				"Cancelled",
				"Reversed",
				"Split",
				"Escalated",
				"Notified",
				"Verified",
			],
			required: true,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

// Schema for payment timeline (inside payment history)
const paymentTimelineSchema = new Schema(
	{
		type: {
			type: String,
			enum: [
				"Requested",
				"Verified",
				"Paid",
				"Rejected",
				"Flagged",
				"Disputed",
				"Cancelled",
				"Processed",
				"Reversed",
			],
			default: "Requested",
		},
		date: {
			type: Date,
			default: Date.now,
		},
		amount: {
			type: Number,
			default: 0,
		},
		notes: {
			type: String,
			default: "",
		},
	},
	{ _id: false }
);

// Schema for payment history with a unique ID
const paymentHistorySchema = new Schema(
	{
		_id: {
			type: Schema.Types.ObjectId,
			default: mongoose.Types.ObjectId,
		},
		amount: {
			type: Number,
			required: true,
			default: 0, // Ensure this is not undefined
		},
		date: {
			type: Date,
			required: true,
			default: Date.now,
		},
		notes: {
			type: String,
			default: "",
		},
		isPaid: {
			type: Boolean,
			required: true,
			default: false,
		},
		paymentFlags: [paymentFlagsSchema], // Updated to use the correct schema
		paymentNotes: {
			type: String,
			default: "",
		},
		verificationStatus: {
			type: String,
			enum: ["Pending", "Verified", "Rejected", "Paid", "Flagged"],
			default: "Pending",
		},
		verificationCode: {
			type: String,
		},
		timeline: [paymentTimelineSchema], // Timeline inside payment history
		paymentMethod: {
			type: String,
			enum: ["Bank Transfer", "Mobile Money", "Cash", "Cheque"],
			default: "Bank Transfer",
		},
		paymentStatus: {
			type: String,
			enum: ["Paid", "Pending", "Failed"],
			default: "Pending",
		},
		paymentReference: {
			type: String,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// Main earnings schema
const earningsSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		grossEarnings: {
			type: Number,
			default: 0,
		},
		netEarnings: {
			type: Number,
			default: 0,
		},
		// Total amount pending reversal
		pendingReversedAmount: {
			type: Number,
			default: 0,
		},
		balance: {
			type: Number,
			default: 0,
		},
		// balance - pendingReversedAmount
		amountToPay: {
			type: Number,
			default: 0,
		},
		// all payments made
		totalPaid: {
			type: Number,
			default: 0,
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
		earnings: [earningsEntrySchema],
		paymentHistory: {
			type: [paymentHistorySchema],
			default: [],
		},
		timeline: [
			{
				type: {
					type: String,
					enum: [
						"Requested",
						"Verified",
						"Paid",
						"Rejected",
						"Flagged",
						"Disputed",
						"Cancelled",
						"Processed",
						"Reversed",
					],
					default: "Requested",
				},
				date: {
					type: Date,
					default: Date.now,
				},
				amount: {
					type: Number,
					default: 0,
				},
				notes: {
					type: String,
					default: "",
				},
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		deletedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

// Indexes for faster queries
earningsSchema.index({ userId: 1 });
earningsSchema.index({ grossEarnings: 1 });
earningsSchema.index({ netEarnings: 1 });
earningsSchema.index({ balance: 1 });

// Middleware to automatically calculate `amountToPay` and zero out balance after payment request
earningsSchema.pre("save", function (next) {
	if (this.isModified("balance") || this.isModified("pendingReversedAmount")) {
		this.amountToPay = this.balance - this.pendingReversedAmount;
	}
	next();
});

// Reference integrity checks
earningsSchema.pre("save", async function (next) {
	try {
		const user = await mongoose.model("User").findById(this.userId);
		if (!user) {
			throw new Error("Invalid user ID");
		}
		next();
	} catch (error) {
		next(error);
	}
});

module.exports = mongoose.model("Earnings", earningsSchema);
