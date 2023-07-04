const express = require("express");
const router = express.Router();
const Chat = require("../Models/chatModel.jsx");
const User = require("../Models/UserModel.jsx");

// Handler for GET request to /api/chats
// Fetches chats data
router.get("/chats", async (req, res) => {
	try {
		// Fetch the chats data from the database
		const chats = await Chat.find();
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
router.post("/add", async (req, res) => {
	try {
		const { id, sender, recipient, message } = req.body;

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
				recipient: recipient,
				message: message,
				timestamp: new Date().toISOString(),
			});

			const updatedChat = await existingChat.save();
			res.status(200).json(updatedChat);
		} else {
			// Conversation does not exist, create a new chat with the conversation and message
			const newChat = new Chat({
				conversations: [
					{
						id: id,
						messages: [
							{
								id: 1,
								sender: sender,
								recipient: recipient,
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
// Handler for patch request to /api/chats/:id
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

// search for chat by word
router.get("/search/:word", async (req, res) => {
	try {
		// Fetch the chats data from the database
		const chats = await Chat.find({
			messages: { $regex: req.params.word, $options: "i" },
		});
		res.status(200).json(chats);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching chats data",
			error: err,
		});
	}
});

module.exports = router;
