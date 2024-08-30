const express = require("express");
const router = express.Router();
const EarningsModel = require("../Models/EarningsModel");
const UserModel = require("../Models/UserModel");
const { authenticateToken, isAdmin } = require("../Middleware/Auth");
const { sendPaymentNotificationEmail } = require("./PaymentNotifications");
const mongoose = require("mongoose");
require("dotenv").config();

// Helper function to get user email
async function getUserEmail(userId) {
	try {
		const user = await UserModel.findById(userId);
		return user ? user.email : null;
	} catch (error) {
		console.error(`Error fetching email for user ${userId}:`, error);
		return null;
	}
}

// Route: GET /earnings
// Description: Retrieve all earnings records (Admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
	try {
		const earnings = await EarningsModel.find();
		res.json(earnings);
	} catch (err) {
		console.error("Error fetching all earnings:", err);
		res
			.status(500)
			.json({ message: "Server Error: Unable to fetch earnings." });
	}
});

// Route: GET /earnings/:userId
// Description: Retrieve earnings for a specific user
router.get("/:userId", authenticateToken, async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({ message: "User ID is required." });
	}

	try {
		const earnings = await EarningsModel.findOne({ userId });

		if (!earnings) {
			return res
				.status(404)
				.json({ message: "Earnings not found for this user." });
		}

		res.json(earnings);
	} catch (err) {
		console.error(`Error fetching earnings for user ${userId}:`, err);
		res
			.status(500)
			.json({ message: "Server Error: Unable to fetch earnings." });
	}
});

// Route: POST /earnings/:userId/request
// Description: Request payment for the available `amountToPay` (Specific to user ID)
router.post("/:userId/request", authenticateToken, async (req, res) => {
	const { userId } = req.params;

	if (!userId || userId !== req.user._id.toString()) {
		return res.status(400).json({ message: "Invalid User ID." });
	}

	try {
		const earnings = await EarningsModel.findOne({ userId });

		if (!earnings || earnings.amountToPay <= 0) {
			return res
				.status(400)
				.json({ message: "No available amount to request." });
		}

		const requestedAmount = earnings.amountToPay;

		// Set balance, amountToPay, and pendingReversedAmount to zero after requesting payment
		earnings.amountToPay = 0;
		earnings.balance = 0;
		earnings.pendingReversedAmount = 0;
		earnings.requestedAt = new Date();

		// Add the request to payment history
		const paymentEntry = {
			_id: new mongoose.Types.ObjectId(),
			amount: requestedAmount,
			date: earnings.requestedAt,
			notes: "Payment Requested",
			isPaid: false,
			paymentFlags: [{ type: "Requested" }],
			paymentNotes: "Payment request initiated.",
			verificationStatus: "Pending",
			paymentMethod: "Bank Transfer",
			paymentStatus: "Pending",
			timeline: [
				{
					type: "Requested",
					date: new Date(),
					amount: requestedAmount,
					notes: "Payment requested by user.",
				},
			],
		};

		earnings.paymentHistory.push(paymentEntry);

		await earnings.save();

		// Prepare payment details for the notification
		const paymentDetails = {
			paymentId: paymentEntry._id.toString(),
			amount: requestedAmount,
			date: earnings.requestedAt,
			status: "Payment Requested",
			transactionId: null,
			holder: req.user.name || "N/A",
			phone: req.user.phone || "N/A",
			customMessage: `Your payment request of KSh. ${requestedAmount.toLocaleString()} has been successful. Please allow up to 5 working days for processing. Thank you.`,
		};

		res.json({
			message: "Payment request successful.",
			paymentId: paymentEntry._id,
			requestedAmount,
			newAmountToPay: earnings.amountToPay,
			remainingBalance: earnings.balance,
		});

		// Notify user about the payment request
		const userEmail = await getUserEmail(userId);
		if (userEmail) {
			await sendPaymentNotificationEmail(userEmail, paymentDetails);
		}
	} catch (err) {
		console.error(`Error processing payment request for user ${userId}:`, err);
		res
			.status(500)
			.json({ message: "Server Error: Unable to process payment request." });
	}
});

// Route: POST /earnings/:userId/reverse/:requestId
// Description: Update the status to "Reversed", and adjust `pendingReversedAmount` if necessary
router.post(
	"/:userId/reverse/:requestId",
	authenticateToken,
	isAdmin,
	async (req, res) => {
		const { userId, requestId } = req.params;
		const { amount, reason } = req.body; // Amount to be reversed and reason

		if (!userId || !requestId || !amount || amount <= 0 || isNaN(amount)) {
			return res.status(400).json({ message: "Invalid parameters." });
		}

		try {
			const earnings = await EarningsModel.findOne({ userId });

			if (!earnings) {
				return res
					.status(404)
					.json({ message: "Earnings not found for this user." });
			}

			const paymentEntry = earnings.paymentHistory.id(requestId);

			if (!paymentEntry) {
				return res
					.status(404)
					.json({ message: "Payment history entry not found." });
			}

			if (paymentEntry.paymentStatus === "Paid") {
				// If payment is already paid, just add the reversal amount to pendingReversedAmount
				earnings.pendingReversedAmount += amount;
			} else {
				// Calculate the remaining amount after reversing from the payment history
				const remainingAmount = amount - paymentEntry.amount;

				// Deduct the amount from the payment history
				paymentEntry.amount = Math.max(paymentEntry.amount - amount, 0);

				// If the reversal amount exceeds the payment history amount, adjust the pending reversal amount
				if (remainingAmount > 0) {
					earnings.pendingReversedAmount += remainingAmount;
				}
			}

			// Calculate the `amountToPay`
			earnings.amountToPay = earnings.balance - earnings.pendingReversedAmount;

			// Update the status to "Reversed" and log it in the timeline
			paymentEntry.paymentFlags.push({
				type: "Reversed",
				date: new Date(),
			});

			paymentEntry.timeline.push({
				type: "Reversed",
				date: new Date(),
				amount: -amount, // Log the reversed amount
				notes: reason || "Payment Reversed",
			});

			// Save the updated earnings document
			await earnings.save();

			// Notify user about the status update and amount deduction (optional)
			const userEmail = await getUserEmail(userId);
			if (userEmail) {
				await sendPaymentNotificationEmail(userEmail, {
					paymentId: earnings._id.toString(),
					amount: -amount,
					date: new Date(),
					status: "Payment Reversed",
					transactionId: null,
					holder: req.user.name || "N/A",
					phone: req.user.phone || "N/A",
					customMessage: `An amount of KSh. ${amount.toLocaleString()} has been reversed from your payment history. Please contact support for more details.`,
				});
			}

			res.json({
				message:
					"Payment status updated to Reversed, amount adjusted accordingly.",
				updatedPaymentStatus: "Reversed",
				updatedPaymentAmount: paymentEntry.amount,
				newAmountToPay: earnings.amountToPay,
				pendingReversedAmount: earnings.pendingReversedAmount,
			});
		} catch (err) {
			console.error(
				`Error updating payment status and amount for user ${userId}:`,
				err
			);
			res.status(500).json({
				message: "Server Error: Unable to update payment status and amount.",
			});
		}
	}
);

// Route: POST /earnings/:userId/verify/:requestId
// Description: Verify a specific payment request (Admin only)
router.post(
	"/:userId/verify/:requestId",
	authenticateToken,
	isAdmin,
	async (req, res) => {
		const { userId, requestId } = req.params;
		const { notes, verificationCode } = req.body; // Optional notes and verification code

		if (!userId || !requestId) {
			return res
				.status(400)
				.json({ message: "User ID and Request ID are required." });
		}

		try {
			const earnings = await EarningsModel.findOne({ userId });

			if (!earnings) {
				return res
					.status(404)
					.json({ message: "Earnings not found for this user." });
			}

			const paymentRequest = earnings.paymentHistory.id(requestId);

			if (!paymentRequest) {
				return res.status(404).json({ message: "Payment request not found." });
			}

			// Check if the payment request is already verified
			if (paymentRequest.verificationStatus === "Verified") {
				return res
					.status(400)
					.json({ message: "Payment request is already verified." });
			}

			// Mark the payment request as verified
			paymentRequest.verificationStatus = "Verified";
			paymentRequest.verificationCode =
				verificationCode || paymentRequest.verificationCode;
			paymentRequest.paymentFlags.push({ type: "Verified", date: new Date() });
			paymentRequest.paymentNotes = notes || paymentRequest.paymentNotes;
			paymentRequest.timeline.push({
				type: "Verified",
				date: new Date(),
				amount: paymentRequest.amount,
				notes: notes || "Payment request verified.",
			});

			await earnings.save();

			// Prepare verification details for the notification
			const verificationDetails = {
				paymentId: earnings._id.toString(),
				requestId: requestId,
				amount: paymentRequest.amount,
				date: new Date(),
				status: "Payment Verified",
				transactionId: null, // You may need to populate this from your payment gateway
				holder: req.user.name || "N/A",
				phone: req.user.phone || "N/A",
				customMessage: `Your payment request of KSh. ${paymentRequest.amount.toLocaleString()} has been successfully verified. Thank you for your patience!`,
			};

			// Notify user about the verification
			const userEmail = await getUserEmail(userId);
			if (userEmail) {
				await sendPaymentNotificationEmail(userEmail, verificationDetails);
			}

			res.json({
				message: "Payment request verified successfully.",
				verifiedAmount: paymentRequest.amount,
			});
		} catch (err) {
			console.error(
				`Error verifying payment for user ${userId} and request ${requestId}:`,
				err
			);
			res
				.status(500)
				.json({ message: "Server Error: Unable to verify payment request." });
		}
	}
);

// Route: POST /earnings/:userId/pay/:requestId
// Description: Mark a specific payment request as paid (Admin only)
router.post(
	"/:userId/pay/:requestId",
	authenticateToken,
	isAdmin,
	async (req, res) => {
		const { userId, requestId } = req.params;
		const { notes } = req.body; // Optional notes for the payment

		if (!userId || !requestId) {
			return res
				.status(400)
				.json({ message: "User ID and Request ID are required." });
		}

		try {
			const earnings = await EarningsModel.findOne({ userId });

			if (!earnings) {
				return res
					.status(404)
					.json({ message: "Earnings not found for this user." });
			}

			const paymentRequest = earnings.paymentHistory.id(requestId);

			if (!paymentRequest) {
				return res.status(404).json({ message: "Payment request not found." });
			}

			// Check if the payment request is not already paid
			if (paymentRequest.isPaid) {
				return res
					.status(400)
					.json({ message: "Payment request is already paid." });
			}

			// Mark the payment request as paid
			paymentRequest.isPaid = true;
			paymentRequest.paymentStatus = "Paid";
			paymentRequest.paymentFlags.push({ type: "Paid", date: new Date() });
			paymentRequest.paymentNotes = notes || paymentRequest.paymentNotes;
			paymentRequest.timeline.push({
				type: "Paid",
				date: new Date(),
				amount: paymentRequest.amount,
				notes: "Payment completed.",
			});

			// Update the earnings totalPaid
			earnings.totalPaid += paymentRequest.amount;

			// Save the updated earnings document
			await earnings.save();

			// Prepare payment details for the notification
			const paymentDetails = {
				paymentId: earnings._id.toString(),
				requestId: requestId,
				amount: paymentRequest.amount,
				date: new Date(),
				status: "Payment Completed",
				transactionId: null,
				holder: req.user.name || "N/A",
				phone: req.user.phone || "N/A",
				customMessage: `Your payment of KSh. ${paymentRequest.amount.toLocaleString()} has been successfully completed. Note that it may take up to 5 working days to reflect in your account. These transactions are subject to verification and under some circumstances the payments can be reversed. Thank you!`,
			};

			// Notify user about the payment
			const userEmail = await getUserEmail(userId);
			if (userEmail) {
				await sendPaymentNotificationEmail(userEmail, paymentDetails);
			}

			res.json({
				message: "Payment processed successfully.",
				totalPaid: earnings.totalPaid,
			});
		} catch (err) {
			console.error(
				`Error processing payment for user ${userId} and request ${requestId}:`,
				err
			);
			res
				.status(500)
				.json({ message: "Server Error: Unable to process payment." });
		}
	}
);

// Route: DELETE /earnings
// Description: Delete all earnings records (for debugging purposes only)
router.delete("/", async (req, res) => {
	try {
		const earnings = await EarningsModel.deleteMany();
		res.json(earnings);
	} catch (err) {
		res
			.status(500)
			.json({ error: "Internal Server Error", details: err.message });
	}
});

module.exports = router;
