import React, { useEffect, useState } from "react";
import "./ConsultChat.css";
import { Badge, Modal } from "antd";
import axios from "axios";
import SettleConsultation from "../SettleConsultation/SettleConsultation";

const ConsultChat = ({ consult, userData }) => {
	const [status, setStatus] = useState("");
	const [settledAt, setSettledAt] = useState(null);
	const [amountCharged, setAmountCharged] = useState(null);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [currentMessages, setCurrentMessages] = useState([]);
	const [sender, setSender] = useState("");
	const [recipient, setRecipient] = useState("");
	const [groupedMessages, setGroupedMessages] = useState({});
	const [isMoreOpen, setIsMoreOpen] = useState(false);
	const [loading, setLoading] = useState(true); // Add loading state

	const fetchChatMessages = () => {
		axios
			.get("https://agrisolve-techsupport254.vercel.app/chats/chats")
			.then((response) => {
				const data = response.data;
				setMessages(data);
				setLoading(false); // Mark loading as false when messages are fetched
			})
			.catch((error) => {
				throw new Error("Failed to fetch chat messages");
			});
	};

	useEffect(() => {
		fetchChatMessages();
	}, [consult]);

	useEffect(() => {
		if (messages && messages.length > 0 && consult) {
			let consultId = consult._id;

			let filteredMessages = messages.filter(
				(message) => message.conversations[0]?.id === consultId
			);

			if (filteredMessages.length > 0) {
				setCurrentMessages(filteredMessages[0]?.conversations[0]?.messages);
			}
		}
	}, [messages, consult]);

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
			id: consult?._id,
			refId: userData?._id,
			recipient: consult?.acceptedById,
			recipientName: consult?.acceptedBy,
			sender: userData?._id,
			senderName: userData?.username,
			message: message,
		};

		axios
			.post("https://agrisolve-techsupport254.vercel.app/chats/add", newMessage)
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

	return (
		<div className="ConsultChat">
			<div className="ChatContainer">
				<div className="ChatHeader">
					<i className="fas fa-arrow-left"></i>
					<div className="ChatHeaderLeft">
						<div className="ProfilePicture">
							<img
								src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
								alt="profile"
							/>
						</div>
						<div className="ProfileDetails">
							<div className="ProfileName">{consult?.acceptedBy}</div>
							<div className="ProfileStatus">Online</div>
						</div>
					</div>
					<div className="ChatHeaderRight">
						<div className="HeaderInfo">
							<span>
								Subject : &nbsp;
								<i className="fas fa-info-circle"></i> &nbsp;
								{consult?.subject}
							</span>
							<p>
								Posted on : &nbsp;
								<i className="fas fa-calendar-alt"></i> &nbsp;
								{new Date(consult?.date).toDateString()}
							</p>
						</div>
						<div className="HeaderMore">
							<p>
								{status === "pending" ? (
									<span className="Pending">Pending</span>
								) : (
									<span className="Settled">
										Accepted on : {new Date(settledAt).toDateString()}
									</span>
								)}
							</p>
							<p>
								Amount: &nbsp;
								{status === "Solved" ? (
									<span>
										<i className="fas fa-money-bill-wave"></i>
										&nbsp;KSh.
										{amountCharged}
									</span>
								) : null}
							</p>
						</div>
						<i
							className="fas fa-ellipsis-v"
							onClick={() => {
								handleMoreClick();
							}}
							style={{ cursor: "pointer" }}
						></i>
					</div>
				</div>
				<div className="ChatMessages">
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
			{isMoreOpen && (
				<Modal
					open={isMoreOpen}
					onClose={() => setIsMoreOpen(false)}
					footer={null}
					centered={true}
					width={400}
				>
					<SettleConsultation consult={consult} setIsMoreOpen={setIsMoreOpen} />
				</Modal>
			)}
		</div>
	);
};

export default ConsultChat;
