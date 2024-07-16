const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel");

// get all chats
router.get("/", async (req, res) => {
	try {
		const chats = await Chat.find();
		res.status(200).json(chats);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching chats data",
			error: err,
		});
	}
});

// Handler for GET request to /api/chats
// Fetches chats data based on query parameters
router.get("/chats", async (req, res) => {
	const { refId, recipient, consultId } = req.query;

	try {
		let query = {};

		if (refId) query.refId = refId;
		if (recipient) query.recipient = recipient;

		// Fetch the chats data from the database
		const chats = await Chat.find(query).lean();

		let conversations = [];

		// If filtering by consultId, extract only the matching conversations
		if (consultId) {
			chats.forEach((chat) => {
				chat.conversations.forEach((conv) => {
					if (conv.id === consultId) {
						conversations.push(conv);
					}
				});
			});
		}

		res.status(200).json(conversations);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching chats data",
			error: err,
		});
	}
});

// Handler for GET request to /api/chats/user/:userId
// Fetches chats data by userId
router.get("/chats/user/:userId", async (req, res) => {
	try {
		// Fetch the chats data from the database
		const chats = await Chat.find({
			$or: [
				{ "conversations.messages.sender": req.params.userId },
				{ "conversations.messages.recipient": req.params.userId },
			],
		});
		res.status(200).json(chats);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching chats data",
			error: err,
		});
	}
});

// Handler for GET request to /api/chats/:id
// Fetches chats data by id
router.get("/chats/:id", async (req, res) => {
	try {
		// Fetch the chats data from the database
		const chat = await Chat.findById(req.params.id);
		res.status(200).json(chat);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching chats data",
			error: err,
		});
	}
});

// Handler for POST request to /api/chats/add
// Adds a new chat
router.post("/chats/add", async (req, res) => {
	try {
		const { id, sender, recipient, message, refId, senderName, recipientName } =
			req.body;

		// Check if the conversation already exists
		const existingChat = await Chat.findOne({ "conversations.id": id });

		if (existingChat) {
			// Conversation already exists, add the new message to the existing conversation
			const conversation = existingChat.conversations.find(
				(conv) => conv.id === id
			);

			conversation.messages.push({
				id: conversation.messages.length + 1,
				sender: sender,
				senderName: senderName,
				recipient: recipient,
				recipientName: recipientName,
				message: message,
				timestamp: new Date().toISOString(),
			});

			const updatedChat = await existingChat.save();
			res.status(200).json(updatedChat);
		} else {
			const newChat = new Chat({
				refId: refId,
				recipient: recipient,
				conversations: [
					{
						id: id,
						messages: [
							{
								id: 1,
								sender: sender,
								senderName: senderName,
								recipient: recipient,
								recipientName: recipientName,
								message: message,
								timestamp: new Date().toISOString(),
							},
						],
					},
				],
			});

			const chat = await newChat.save();
			res.status(200).json(chat);
		}
	} catch (err) {
		res.status(400).json({
			message: "Error creating chat",
			error: err,
		});
	}
});

// Handler for PATCH request to /api/chats/:id
// Updates a chat
router.patch("/chats/:id", async (req, res) => {
	try {
		const { id, status } = req.body;

		// Fetch the chat data from the database
		const chat = await Chat.findOne({ "conversations.id": id });

		if (chat) {
			// Find the conversation to update
			const conversation = chat.conversations.find((conv) => conv.id === id);

			// Update the status of each message in the conversation to "read"
			conversation.messages.forEach((message) => {
				message.status = status;
			});

			// Save the updated chat
			const updatedChat = await chat.save();
			res.status(200).json(updatedChat);
		} else {
			res.status(404).json({
				message: "Conversation not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			message: "Error updating chat",
			error: err,
		});
	}
});

// Search for chat by word
router.get("/search/:word", async (req, res) => {
	try {
		// Fetch the chats data from the database
		const chats = await Chat.find({
			"conversations.messages.message": {
				$regex: req.params.word,
				$options: "i",
			},
		});
		res.status(200).json(chats);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching chats data",
			error: err,
		});
	}
});

// get the unread messages count of the user
router.get("/unread/:userId", async (req, res) => {
	try {
		const chats = await Chat.find({
			"conversations.messages.recipient": req.params.userId,
			"conversations.messages.status": "sent",
		});

		let unreadCount = 0;

		chats.forEach((chat) => {
			chat.conversations.forEach((conv) => {
				conv.messages.forEach((msg) => {
					if (msg.recipient === req.params.userId && msg.status === "sent") {
						unreadCount++;
					}
				});
			});
		});

		res.status(200).send(String(unreadCount));
	} catch (err) {
		res.status(400).json({
			message: "Error fetching unread messages count",
			error: err,
		});
	}
});

module.exports = router;
