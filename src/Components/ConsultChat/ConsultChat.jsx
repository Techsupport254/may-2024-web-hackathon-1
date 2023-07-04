import React, { useEffect, useState } from "react";
import "./ConsultChat.css";
import { Badge } from "antd";
import axios from "axios";

const ConsultChat = ({ consult, userData }) => {
	const { status, settledAt, amountCharged } = consult;
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [currentMessages, setCurrentMessages] = useState(null);
	const [sender, setSender] = useState("");
	const [recipient, setRecipient] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		console.log(consult);
	}, []);

	useEffect(() => {
		const fetchDataInterval = setInterval(() => {
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
			}, 2000);
			fetchChatMessages()
				.then((data) => setMessages(data))
				.catch((error) =>
					console.error("Error fetching chat messages:", error)
				);
		}, 1000);

		// Clear the interval when the component is unmounted or the dependencies change
		return () => {
			clearInterval(fetchDataInterval);
		};
	}, []);
	// loading
	loading && (
		<div className="loader">
			<i className="fa fa-spinner fa-spin"></i>
		</div>
	);

	// load messages on mount
	useEffect(() => {
		fetchChatMessages()
			.then((data) => setMessages(data))
			.catch((error) => console.error("Error fetching chat messages:", error));
	}, []);

	const fetchChatMessages = async () => {
		try {
			const response = await axios.get("http://localhost:4000/chats/chats");

			// Find the chat with the matching consult id
			const currentChat = response.data.find(
				(chat) => chat.conversations[0].id === consult._id
			);

			if (currentChat) {
				setCurrentMessages(currentChat.conversations[0].messages);
				setSender(currentChat.conversations[0].messages[0].sender);
				setRecipient(currentChat.conversations[0].messages[0].recipient);
			} else {
				setCurrentMessages([]);
			}

			return response.data;
		} catch (error) {
			throw new Error("Failed to fetch chat messages");
		}
	};
	const handleMediaClick = () => {};

	const handleAttchmentClick = () => {};

	const handleFormSubmit = (e) => {
		e.preventDefault();

		const newMessage = {
			id: consult._id,
			recipient: consult.professionalName,
			sender: userData.username,
			message: message,
		};

		axios
			.post("http://localhost:4000/chats/add", newMessage)
			.then((response) => {
				console.log(response.data);
				fetchChatMessages()
					.then((data) => setMessages(data))
					.catch((error) =>
						console.error("Error fetching chat messages:", error)
					);
			})
			.catch((error) => {
				console.error("Error sending message:", error);
			});

		setMessage("");
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
							<div className="ProfileName">{consult.professionalName}</div>
							<div className="ProfileStatus">Online</div>
						</div>
					</div>
					<div className="ChatHeaderRight">
						<div className="HeaderInfo">
							<span>
								Subject : &nbsp;
								<i className="fas fa-info-circle"></i> &nbsp;
								{consult.subject}
								&nbsp;
								{consult._id}
							</span>
							<p>
								Posted on : &nbsp;
								<i className="fas fa-calendar-alt"></i> &nbsp;
								{new Date(consult.date).toDateString()}
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
								// setConsults(consults.filter((item) => item.id !== consult.id));
							}}
							style={{ cursor: "pointer" }}
						></i>
					</div>
				</div>
				<div className="ChatMessages">
					<div className="ChatMessages">
						{currentMessages === null ? (
							<div className="NoMessages">No messages yet</div>
						) : currentMessages.length === 0 ? (
							<div className="NoMessages">No messages yet</div>
						) : (
							currentMessages.map((message, index) => (
								<div
									className={`Message ${
										message.sender === userData.username
											? "SenderMessage"
											: "ReceiverMessage"
									}`}
									key={index}
								>
									<div className="MessageContent">{message.message}</div>
									<div className="MessageTime">
										{new Date(message.timestamp).toLocaleTimeString()}
									</div>
								</div>
							))
						)}
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
								onClick={handleAttchmentClick}
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
	);
};

export default ConsultChat;
