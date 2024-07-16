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
	const [filteredById, setFilteredById] = useState([]);
	const [unfilteredChats, setUnfilteredChats] = useState([]);
	const [selectedChatId, setSelectedChatId] = useState(null);

	useEffect(() => {
		const fetchConsults = async () => {
			try {
				const response = await axios.get(
					"http://localhost:8000/consults/consults"
				);
				const data = response.data;
				setConsults(data);
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
			const response = await axios.get("http://localhost:8000/chats");
			const data = response.data;
			setUnfilteredChats(data);

			// Filter chats by refId or recipientId
			const filterChats = data.filter(
				(chat) =>
					chat.refId === userData._id || chat.recipientId === userData._id
			);
			setChats(filterChats);

			// Filter chats by unread messages
			const unreadMessages = filterChats.reduce((accumulator, chat) => {
				const messages = chat.conversations.flatMap(
					(conversation) => conversation.messages
				);
				const sentMessages = messages.filter((message) => {
					return (
						message.status === "sent" &&
						message.senderName !== userData?.username
					);
				});
				accumulator.push(...sentMessages);
				return accumulator;
			}, []);

			setUnreadCount(unreadMessages.length);
		} catch (error) {
			console.error("Error fetching chats:", error);
		}
	};

	// Call the fetchChats function
	useEffect(() => {
		fetchChats();
	}, []);

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

	const filterCounsultsById = consults.filter(
		(consult) => consult.refId === userData._id
	);

	let filteredConsults = filterCounsultsById;
	if (clickedContentType === "accepted") {
		filteredConsults = filterCounsultsById.filter(
			(consult) => consult.status === "accepted"
		);
	} else if (clickedContentType === "pending") {
		filteredConsults = filterCounsultsById.filter(
			(consult) => consult.status === "pending"
		);
	} else if (clickedContentType === "rejected") {
		filteredConsults = filterCounsultsById.filter(
			(consult) => consult.status === "rejected"
		);
	} else if (clickedContentType === "consult") {
		filteredConsults = filterCounsultsById.filter(
			(consult) => consult.status === "pending"
		);
	}

	// count filteredConsults except for the ones with status "seen"
	const unseenConsultsCount = filterCounsultsById.reduce(
		(accumulator, consult) => {
			if (consult.newConsult === true && consult.status === "accepted") {
				accumulator++;
			}
			return accumulator;
		},
		0
	);

	// unseen solved consults
	const unseenSolvedConsultsCount = filterCounsultsById.reduce(
		(accumulator, consult) => {
			if (consult.newConsult === true && consult.status === "solved") {
				accumulator++;
			}
			return accumulator;
		},
		0
	);

	const updateChat = async (selectedChat) => {
		try {
			const conversationId = selectedChat.conversations[0].id;
			await axios.patch(`http://localhost:8000/chats/chats/${conversationId}`, {
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
		const refId = chat.refId;
		const recipientId = chat.recipient;
		const consultId = chat.conversations[0].id;
		window.location.href = `/consult-chats?refId=${refId}&recipientId=${recipientId}&consultId=${consultId}`;
	};

	useEffect(() => {
		if (selectedChat) {
			const chatId = selectedChat.conversations[0].id;
			setSelectedChatId(chatId);
		} else {
			setSelectedChatId(null);
		}
	}, [selectedChat]);

	const getSelectedConsult = () => {
		let selectedConsult = null;
		if (selectedChatId) {
			selectedConsult = consults.find(
				(consult) => consult._id === selectedChatId
			);
		}
		return selectedConsult;
	};
	return (
		<div className="AccountConsults">
			<div className="AccountConsultsContainer">
				<div className="AccountConsultsTop">
					<button className="AddConsult" onClick={handleAddConsultClick}>
						<i className="fas fa-plus-circle"></i> New Consultation
					</button>
					<div className="Accepted">
						<div
							className="SolvedConsults"
							onClick={() => handleConsultCategoryClick("solved")}
						>
							<Badge badgeContent={unseenSolvedConsultsCount} color="secondary">
								<i class="fas fa-circle-check"></i>
							</Badge>
							Solved
						</div>
						<div
							className="AcceptedConsults"
							onClick={() => handleConsultCategoryClick("accepted")}
						>
							<Badge badgeContent={unseenConsultsCount} color="primary">
								<i class="fa-regular fa-circle-check"></i>
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
				<ConsultTable
					userData={userData}
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
						<ConsultMore
							userData={userData}
							consult={selectedConsult}
							handleChatClick={handleChatClick}
						/>
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
						<AcceptedTable
							consults={filteredConsults}
							userData={userData}
							handleChatClick={handleChatClick}
						/>
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
		</div>
	);
};

export default AccountConsults;
