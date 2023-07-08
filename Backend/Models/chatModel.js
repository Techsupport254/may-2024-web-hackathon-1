const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
	},
	sender: {
		type: String,
		required: true,
	},
	senderName: {
		type: String,
		required: true,
	},

	recipient: {
		type: String,
		required: true,
	},
	recipientName: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: "sent",
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
	},
});

const conversationSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},

	messages: [messageSchema],
});

const chatSchema = new mongoose.Schema({
	refId: {
		type: String,
		required: true,
	},
	recipient: {
		type: String,
		required: true,
	},
	conversations: [conversationSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
