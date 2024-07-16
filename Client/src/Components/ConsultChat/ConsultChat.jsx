import React, { useEffect, useState, useContext, useCallback } from "react";
import "./ConsultChat.css";
import { Badge, Modal } from "antd";
import axios from "axios";
import SettleConsultation from "../SettleConsultation/SettleConsultation";
import { ApiContext } from "../../Context/ApiProvider";
import { useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";

const ConsultChat = () => {
	const { userData } = useContext(ApiContext);
	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const refId = query.get("refId");
	const recipientId = query.get("recipientId");
	const consultId = query.get("consultId");

	const [status, setStatus] = useState("");
	const [settledAt, setSettledAt] = useState(null);
	const [amountCharged, setAmountCharged] = useState(null);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [currentMessages, setCurrentMessages] = useState([]);
	const [groupedMessages, setGroupedMessages] = useState({});
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [consult, setConsult] = useState(null);
	const [acceptedBy, setAcceptedBy] = useState(null);
	const [recipient, setRecipient] = useState(null);
	const [ChatMessages, setChatMessages] = useState([]);
	const [chatLastMessage, setChatLastMessage] = useState(null);
	const [searchInput, setSearchInput] = useState("");

	const fetchRecipient = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/auth/users/${recipientId}`
			);
			setRecipient(response.data);
		} catch (error) {
			console.error("Error fetching recipient:", error);
		}
	};

	const fetchConsult = useCallback(async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/consults/consults/${consultId}`
			);
			setConsult(response.data);
		} catch (error) {
			console.error("Error fetching consult data:", error);
		}
	}, [consultId]);

	const fetchChatMessages = useCallback(async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/chats/chats?refId=${refId}&recipient=${recipientId}&consultId=${consultId}`
			);
			setMessages(response.data);
			setLoading(false);
		} catch (error) {
			console.error("Failed to fetch chat messages", error);
		}
	}, [refId, recipientId, consultId]);

	useEffect(() => {
		fetchConsult();
		fetchRecipient();
	}, [fetchConsult, recipientId]);

	useEffect(() => {
		fetchChatMessages();
	}, [fetchChatMessages]);

	useEffect(() => {
		if (messages.length > 0) {
			setCurrentMessages(messages.flatMap((conv) => conv.messages || []));
		}
	}, [messages]);

	useEffect(() => {
		if (currentMessages.length > 0) {
			const grouped = currentMessages.reduce((acc, message) => {
				const date = new Date(message.timestamp).toLocaleDateString();
				if (acc[date]) {
					acc[date].push(message);
				} else {
					acc[date] = [message];
				}
				return acc;
			}, {});
			setGroupedMessages(grouped);
		}
	}, [currentMessages]);

	const updateMessageStatus = async (chatId, messageId) => {
		try {
			await axios.patch(`http://localhost:8000/chats/chats/${chatId}`, {
				id: chatId,
				status: "read",
			});
		} catch (error) {
			console.error("Error updating message status:", error);
		}
	};

	useEffect(() => {
		if (currentMessages.length > 0) {
			const lastMessage = currentMessages[currentMessages.length - 1];
			if (
				lastMessage.sender !== userData._id &&
				lastMessage.status !== "read"
			) {
				updateMessageStatus(consultId, lastMessage._id);
			}
		}
	}, [currentMessages, userData._id, consultId]);

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		const newMessage = {
			id: consultId,
			refId: userData?._id,
			recipient: recipientId,
			recipientName: recipient?.name,
			sender: userData?._id,
			senderName: userData?.name,
			message,
		};

		try {
			await axios.post("http://localhost:8000/chats/chats/add", newMessage);
			fetchChatMessages();
			setMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const fetchAcceptedBy = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/auth/users/${recipientId}`
			);
			setAcceptedBy(response.data);
		} catch (error) {
			console.error("Error fetching acceptedBy:", error);
		}
	};

	useEffect(() => {
		if (consult) {
			fetchAcceptedBy();
		}
	}, [consult, recipientId]);

	// fetch chat messages http://localhost:8000/chats/chats/user/:userId
	const fetchChatsMessages = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/chats/chats/user/${userData._id}`
			);
			setChatMessages(response.data);
		} catch (error) {
			console.error("Error fetching chat messages:", error);
		}
	};

	useEffect(() => {
		fetchChatsMessages();
	}, []);

	// Get the last message for a chat
	const getLastMessage = (chat) => {
		const lastMessage = chat?.conversations[0]?.messages.slice(-1)[0];
		return lastMessage?.message;
	};

	return (
		<div className="ConsultChat">
			<div className="ChatContainer">
				<div className="ChatsMessages">
					<div className="ChatMessagesTop">
						<div className="UserProfile">
							<i
								className="fas fa-arrow-left"
								onClick={() => {
									window.history.back();
								}}
							></i>
							<i
								className="fas fa-home"
								onClick={() => {
									window.location.href = "/consult";
								}}
							></i>

							<img src={userData?.profilePicture} alt={userData?.name} />
							<div className="UserDetails">
								<span className="UserName">{userData?.username}</span>
								<p className="UserName">{userData?.name}</p>
							</div>
						</div>
						<div className="ChatMessagesTopSearch">
							<input
								type="text"
								placeholder="Search"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
							/>
							<i className="fas fa-search"></i>
						</div>
					</div>
					<div className="ChatMessagesBottom">
						{ChatMessages.map((chat, index) => (
							<div
								className={`ChatMessage ${
									chatLastMessage === getLastMessage(chat) ? "Active" : ""
								}`}
								key={index}
								onClick={() => {
									window.location.href = `/consult-chats?refId=${chat.refId}&recipientId=${chat.recipient}&consultId=${chat?.conversations?.[0].id}`;
								}}
							>
								<div className="ChatMessageProfile">
									<Avatar
										src={acceptedBy?.profilePicture}
										alt={acceptedBy?.name}
									/>
								</div>
								<div className="ChatMessageDetails">
									<div className="ChatMessageDetailsTop">
										<span className="ChatMessageName">
											{acceptedBy?.username}
										</span>
										<small className="ChatMessageTime">
											{new Date(
												chat?.conversations[0]?.messages.slice(-1)[0]?.timestamp
											).toLocaleTimeString
												? "Today"
												: date ===
												  new Date(Date.now() - 86400000).toLocaleDateString()
												? "Yesterday"
												: date}{" "}
											{new Date(
												chat?.conversations[0]?.messages.slice(-1)[0]?.timestamp
											).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</small>
									</div>
									<div className="ChatMessageDetailsBottom">
										<p
											className="ChatMessageContent"
											style={{
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",

												color:
													chat?.conversations[0]?.messages.filter(
														(message) =>
															message.sender === acceptedBy?._id &&
															message.status !== "read"
													).length > 0
														? "black"
														: "grey",
											}}
										>
											{getLastMessage(chat)
												? getLastMessage(chat).length > 30
													? getLastMessage(chat).substring(0, 30) + "..."
													: getLastMessage(chat)
												: "No messages yet"}
										</p>
										<Badge
											style={{
												backgroundColor:
													chat?.conversations[0]?.messages.filter(
														(message) =>
															message.sender === acceptedBy?._id &&
															message.status !== "read"
													).length > 0
														? "#1890ff"
														: "transparent",
												position: "relative",
												top: "0",
												left: "300%",
												transform: "translate(300%, 0)",
											}}
											count={
												chat?.conversations[0]?.messages.filter(
													(message) =>
														message.sender === acceptedBy?._id &&
														message.status !== "read"
												).length
											}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div>
					<div className="ChatMessages">
						{loading ? (
							<div className="Loading">
								<i className="fas fa-spinner fa-spin"></i>
							</div>
						) : (
							Object.entries(groupedMessages).map(([date, messages]) => (
								<div key={date}>
									<div className="GroupDateContainer">
										<div className="GroupDate">
											{date === new Date().toLocaleDateString()
												? "Today"
												: date ===
												  new Date(Date.now() - 86400000).toLocaleDateString()
												? "Yesterday"
												: date}
										</div>
									</div>
									{messages.map((message, index) => (
										<div
											className={`Message ${
												message.sender === userData._id
													? "SenderMessage"
													: "ReceiverMessage"
											}`}
											key={index}
										>
											<p className="MessageContent">{message.message}</p>
											<div className="MessageTime">
												{new Date(message.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
												{message.sender === userData?._id ? (
													message.status === "read" ? (
														<i className="fas fa-check-double"></i>
													) : (
														<i className="fas fa-check"></i>
													)
												) : null}
											</div>
										</div>
									))}
								</div>
							))
						)}

						{!loading && currentMessages.length === 0 && (
							<div className="NoMessages">No messages yet</div>
						)}
					</div>
					<div className="ChatInput">
						<form onSubmit={handleFormSubmit}>
							<input
								placeholder="Type your message..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
							<div className="Media">
								<i className="fas fa-paperclip" onClick={() => {}}></i>
								<i className="fas fa-camera" onClick={() => {}}></i>
							</div>
							<button type="submit" className="SendButton">
								Send &nbsp; <i className="fas fa-paper-plane"></i>
							</button>
						</form>
					</div>
				</div>
				<div className="ChatHeader">
					{/* <div className="ChatHeaderLeft">
						<div className="ProfilePicture">
							<img
								src={
									acceptedBy?.profilePicture ||
									"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
								}
								alt={acceptedBy?.name}
							/>
						</div>
						<div className="ProfileDetails">
							<div className="ProfileName">{consult?.acceptedBy}</div>
							<div className="ProfileStatus">Online</div>
						</div>
					</div> */}
					<div className="ChatHeaderRight">
						<SettleConsultation
							consult={consult}
							setIsMoreOpen={setIsMoreOpen}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsultChat;
