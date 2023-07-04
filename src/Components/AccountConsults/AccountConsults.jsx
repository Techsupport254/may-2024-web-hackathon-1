import React, { useEffect, useState, useMemo } from "react";
import "./AccountConsults.css";
import ConsultTable from "../ConsultTable/ConsultTable";
import ConsultRight from "../ConsultRight/ConsultRight";
import { Modal } from "antd";
import ConsultModal from "../ConsultModal/ConsultModal";
import axios from "axios";
import ConsultChat from "../ConsultChat/ConsultChat";
import ConsultMore from "../ConsultMore/ConsultMore";
import AcceptedTable from "../AcceptedTable/AcceptedTable";
import { Badge } from "@mui/material";
import Messages from "../Messages/Messages";

const AccountConsults = ({ userData }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [consults, setConsults] = useState([]);
	const [selectedConsult, setSelectedConsult] = useState(null);
	const [clickedContentType, setClickedContentType] = useState(null);
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		const fetchConsults = async () => {
			try {
				const response = await axios.get(
					"http://localhost:4000/consults/consults"
				);
				setConsults(response.data);

				// selectedConsult whose id matches the
			} catch (error) {
				console.log("Error fetching consults:", error);
			}
		};

		fetchConsults();
	}, []);

	useEffect(() => {
		fetchChats();
	}, []);

	const fetchChats = async () => {
		try {
			const response = await axios.get("http://localhost:4000/chats/chats");
			const data = response.data;
			setChats(data);

			const unreadMessages = data.reduce((accumulator, chat) => {
				const messages = chat.conversations.flatMap(
					(conversation) => conversation.messages
				);
				const sentMessages = messages.filter((message) => {
					return (
						message.status === "sent" && message.sender !== userData.username
					);
				});
				accumulator.push(...sentMessages);
				return accumulator;
			}, []);

			setUnreadCount(unreadMessages.length);
			console.log("Unread messages:", unreadMessages.length);
		} catch (error) {
			console.error("Error fetching chats:", error);
		}
	};

	// Call the fetchChats function
	useEffect(() => {
		fetchChats();
	}, []);

	console.log("Chats", chats);

	const handleConsultClick = (consult) => {
		setSelectedConsult(consult);
		setClickedContentType("consult");
	};

	const handleAddConsultClick = () => {
		setClickedContentType("addConsult");
		setIsModalOpen(true);
	};

	const handleConsultCategoryClick = (category) => {
		setClickedContentType(category);
		setIsModalOpen(true);
	};
	let filteredConsults = consults;
	if (clickedContentType === "accepted") {
		filteredConsults = consults.filter(
			(consult) => consult.status === "accepted"
		);
	} else if (clickedContentType === "pending") {
		filteredConsults = consults.filter(
			(consult) => consult.status === "pending"
		);
	} else if (clickedContentType === "rejected") {
		filteredConsults = consults.filter(
			(consult) => consult.status === "rejected"
		);
	} else if (clickedContentType === "consult") {
		filteredConsults = consults.filter(
			(consult) => consult.status === "pending"
		);
	}

	// count filteredConsults except for the ones with status "seen"
	const unseenConsultsCount = consults.reduce((accumulator, consult) => {
		if (consult.newConsult === true && consult.status === "accepted") {
			accumulator++;
		}
		return accumulator;
	}, 0);

	const updateChat = async (selectedChat) => {
		try {
			const conversationId = selectedChat.conversations[0].id;
			console.log(conversationId);
			await axios.patch(`http://localhost:4000/chats/chats/${conversationId}`, {
				id: conversationId,
				status: "read",
			});

			setChats((prevChats) =>
				prevChats.map((prevChat) => {
					if (prevChat.conversations[0].id === conversationId) {
						const updatedConversations = prevChat.conversations.map(
							(conversation) => ({
								...conversation,
								messages: conversation.messages.map((message) => ({
									...message,
									status: "read",
								})),
							})
						);
						return { ...prevChat, conversations: updatedConversations };
					}
					return prevChat;
				})
			);
		} catch (error) {
			console.error("Error updating chat:", error);
		}
	};

	const handleChatClick = (chat) => {
		setSelectedChat(chat);
		updateChat(chat);
	};

	const getSelectedChatId = () => {
		if (selectedChat) {
			const chatId = selectedChat.conversations[0].id;
			return chatId;
		}
		return null;
	};

	console.log("chatid", getSelectedChatId());

	const getSelectedConsult = useMemo(() => {
		if (selectedChat) {
			const chatId = getSelectedChatId();
			const selectedConsult = consults.find((consult) => {
				return consult._id === chatId;
			});
			return selectedConsult || null;
		}
		return null;
	}, [selectedChat, consults]);

	console.log("selectedConsult", getSelectedConsult);

	return (
		<div className="AccountConsults">
			<div className="AccountConsultsContainer">
				{consults.length === 0 ? (
					<div className="AccountConsultsTop">
						<button className="AddConsult" onClick={handleAddConsultClick}>
							<i className="fas fa-plus-circle"></i> Add New Consult
						</button>
						<div className="Accepted">
							<div
								className="AcceptedConsults"
								style={{
									cursor: "not-allowed",
								}}
							>
								<Badge badgeContent={unseenConsultsCount} color="primary">
									<i className="fas fa-check-circle"></i>
								</Badge>
								Accepted
							</div>
							<div
								className="Incoming"
								style={{
									cursor: "not-allowed",
								}}
							>
								<Badge badgeContent={unreadCount} color="info">
									<i className="fas fa-message"></i>
								</Badge>
								Messages
							</div>
						</div>
					</div>
				) : (
					<div className="AccountConsultsTop">
						<button className="AddConsult" onClick={handleAddConsultClick}>
							<i className="fas fa-plus-circle"></i> Add New Consult
						</button>
						<div className="Accepted">
							<div
								className="AcceptedConsults"
								onClick={() => handleConsultCategoryClick("accepted")}
							>
								<Badge badgeContent={unseenConsultsCount} color="primary">
									<i className="fas fa-check-circle"></i>
								</Badge>
								Accepted
							</div>
							<div
								className="Incoming"
								onClick={() => handleConsultCategoryClick("incoming")}
							>
								<Badge badgeContent={unreadCount} color="info">
									<i className="fas fa-message"></i>
								</Badge>
								Messages
							</div>
						</div>
					</div>
				)}
				<ConsultTable
					consults={consults}
					handleConsultClick={handleConsultClick}
				/>
			</div>
			{isModalOpen && clickedContentType === "addConsult" && (
				<Modal
					title="New Consultation"
					open={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					footer={null}
					width={1000}
					centered
				>
					<div className="NewConsult">
						<ConsultModal
							modalClose={() => setIsModalOpen(false)}
							userData={userData}
						/>
					</div>
				</Modal>
			)}
			{selectedConsult && clickedContentType === "consult" && (
				<Modal
					open={selectedConsult !== null}
					onCancel={() => setSelectedConsult(null)}
					footer={null}
					width={800}
					centered
				>
					<div className="SelectedConsult">
						<ConsultMore userData={userData} consult={selectedConsult} />
					</div>
				</Modal>
			)}
			{clickedContentType === "accepted" && (
				<Modal
					title="Accepted Consults"
					open={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					footer={null}
					width={1000}
					centered
				>
					<div className="AcceptedConsults">
						<AcceptedTable consults={filteredConsults} userData={userData} />
					</div>
				</Modal>
			)}
			{clickedContentType === "incoming" && (
				<Modal
					title="Messages"
					open={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					footer={null}
					width={500}
					centered
				>
					<div className="IncomingConsults">
						<Messages
							chats={chats}
							consults={consults}
							userData={userData}
							handleChatClick={handleChatClick}
						/>
					</div>
				</Modal>
			)}
			{selectedChat && (
				<Modal
					open={selectedChat !== null}
					onCancel={() => setSelectedChat(null)}
					footer={null}
					width={800}
					centered
				>
					<ConsultChat userData={userData} consult={getSelectedConsult} />
				</Modal>
			)}
		</div>
	);
};

export default AccountConsults;
