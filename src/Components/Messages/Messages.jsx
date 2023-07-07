import React, { useEffect, useState } from "react";
import "./Messages.css";
import { Badge } from "@mui/material";
import axios from "axios";

const Messages = ({ userData, consults, chats, handleChatClick }) => {
	const [selectedChat, setSelectedChat] = useState(null);
	const [unreadCount, setUnreadCount] = useState(0);
	const updateChat = async (chat) => {
		try {
			const conversationId = chat.conversations[0].id;
			const payload = {
				conversations: chat.conversations.map((conversation) => ({
					...conversation,
					messages: conversation.messages.map((message) => ({
						...message,
						status: "read",
					})),
				})),
			};
			useEffect(() => {
				console.log("chats: ", chats);
			}, [chats]);
			await axios.patch(
				`http://localhost:4000/chats/chats/${conversationId}`,
				payload
			);

			setChats((prevChats) =>
				prevChats.map((prevChat) => {
					if (prevChat.conversations[0].id === conversationId) {
						return { ...prevChat, conversations: payload.conversations };
					}
					return prevChat;
				})
			);
		} catch (error) {
			console.error("Error updating chat:", error);
		}
	};
	const getTimeLabel = (date) => {
		const currentTime = new Date();
		const timeDifference = Math.abs(currentTime - date);
		const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));

		if (hoursDifference < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else if (hoursDifference < 48) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString();
		}
	};

	return (
		<div className="Messages">
			<div className="MessagesContainer">
				{chats.length === 0 && (
					<div className="NoMessages">
						<h3>No Messages yet</h3>
					</div>
				)}
				{chats.map((chat, index) => {
					const lastMessage = chat.conversations[0].messages.slice(-1)[0];
					const unreadCount =
						lastMessage.sender !== userData.username
							? chat.conversations[0].messages.filter(
									(message) =>
										message.status === "sent" &&
										message.senderName !== userData.username
							  ).length
							: 0;

					return (
						<div
							className="MessageRow"
							key={index}
							onClick={() => handleChatClick(chat)}
						>
							<div className="MessageProfile">
								{chat.profilePic ? (
									<img src={chat.profilePic} alt="Profile" />
								) : (
									<img
										src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
										alt="profile"
									/>
								)}
							</div>
							<div className="MessageDetails">
								<span>
									{lastMessage.senderName === userData.username
										? "You"
										: lastMessage.senderName}
								</span>
								<p>{lastMessage.message}</p>
							</div>
							<div className="MessageRight">
								<p>{getTimeLabel(new Date(lastMessage.timestamp))}</p>
								<div className="Bottom">
									<i className="fas fa-caret-down"></i>
									<Badge
										badgeContent={unreadCount}
										color="info"
										style={{ marginLeft: "15px" }}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Messages;
