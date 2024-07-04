import React, { useEffect, useState, useContext, useCallback } from "react";
import "./ConsultChat.css";
import { Badge, Modal } from "antd";
import axios from "axios";
import SettleConsultation from "../SettleConsultation/SettleConsultation";
import { ApiContext } from "../../Context/ApiProvider";
import { useLocation } from "react-router-dom";

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
	const [loading, setLoading] = useState(true); // Add loading state
	const [consult, setConsult] = useState(null); // Add state for consult data
	const [acceptedBy, setAcceptedBy] = useState(null);

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
			const conversations = response.data;
			setMessages(conversations);
			setLoading(false); // Mark loading as false when messages are fetched
		} catch (error) {
			throw new Error("Failed to fetch chat messages");
		}
	}, [refId, recipientId, consultId]);

	useEffect(() => {
		fetchConsult();
	}, [fetchConsult]);

	useEffect(() => {
		fetchChatMessages();
	}, [fetchChatMessages]);

	console.log(messages);

	useEffect(() => {
		if (messages && messages.length > 0) {
			const filteredMessages = messages.flatMap((conv) => conv.messages || []);
			setCurrentMessages(filteredMessages);
		}
	}, [messages]);

	useEffect(() => {
		if (currentMessages && currentMessages.length > 0) {
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

	const handleMediaClick = () => {};

	const handleAttachmentClick = () => {};

	const handleFormSubmit = (e) => {
		e.preventDefault();

		const newMessage = {
			id: consultId,
			refId: userData?._id,
			recipient: recipientId,
			recipientName: recipientId, // This needs to be modified as per your data
			sender: userData?._id,
			senderName: userData?.username,
			message: message,
		};

		axios
			.post("http://localhost:8000/chats/add", newMessage)
			.then((response) => {
				console.log(response.data);
				fetchChatMessages();
			})
			.catch((error) => {
				console.error("Error sending message:", error);
			});

		setMessage("");
	};

	const handleMoreClick = () => {
		setIsMoreOpen(!isMoreOpen);
	};

	console.log(consult);

	// fetch acceptedBy
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
	}, [consult]);

	console.log(acceptedBy);

	return (
		<div className="ConsultChat">
			<div className="ChatContainer">
				<div className="ChatHeader">
					<div className="ChatHeaderLeft">
						<i className="fas fa-arrow-left"></i>
						<div className="ProfilePicture">
							<img
								src={
									acceptedBy?.profilePicture
										? acceptedBy?.profilePicture
										: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
								}
								alt={acceptedBy?.name}
							/>
						</div>
						<div className="ProfileDetails">
							<div className="ProfileName">{consult?.acceptedBy}</div>
							<div className="ProfileStatus">Online</div>
						</div>
					</div>
					<div className="ChatHeaderRight">
						<SettleConsultation
							consult={consult}
							setIsMoreOpen={setIsMoreOpen}
						/>
					</div>
				</div>
				<div>
					<div className="ChatMessages">
						{loading ? (
							<div
								className="Loading"
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<i
									className="fas fa-spinner fa-spin"
									style={{ fontSize: "2rem", color: "green" }}
								></i>
							</div>
						) : null}

						{Object.entries(groupedMessages).map(([date, messages]) => (
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
											message.senderName === userData.username
												? "SenderMessage"
												: "ReceiverMessage"
										}`}
										key={index}
									>
										<div
											className="MessageContent"
											style={{
												backgroundColor: `${
													message.senderName === userData.username
														? "#e8e8e8"
														: "#f1f0f0"
												}`,

												color: `${
													message.senderName === userData.username
														? "#000"
														: "#333"
												}`,

												borderRadius: `${
													message.senderName === userData.username
														? "10px 0 10px 10px"
														: "0 10px 10px 10px"
												}`,

												marginLeft: `${
													message.senderName === userData.username
														? "auto"
														: "0"
												}`,

												marginRight: `${
													message.senderName === userData.username
														? "0"
														: "auto"
												}`,

												marginBottom: `${
													message.senderName === userData.username
														? "10px"
														: "0"
												}`,

												marginTop: `${
													message.senderName === userData.username
														? "10px"
														: "0"
												}`,
											}}
										>
											{message.message}
										</div>
										<div className="MessageTime">
											{new Date(message.timestamp).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
									</div>
								))}
							</div>
						))}

						{currentMessages === null || currentMessages.length === 0 ? (
							<div
								className="NoMessages"
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								No messages yet
							</div>
						) : null}
					</div>
					<div className="ChatInput">
						<form onSubmit={handleFormSubmit}>
							<input
								type="text"
								placeholder="Type your message..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
							/>
							<div className="Media">
								<i
									className="fas fa-paperclip"
									onClick={handleAttachmentClick}
								></i>
								<i className="fas fa-camera" onClick={handleMediaClick}></i>
							</div>
							<button type="submit" className="SendButton">
								Send &nbsp; <i className="fas fa-paper-plane"></i>
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsultChat;
