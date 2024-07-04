import React, { useState, useEffect } from "react";
import "./ConsultLeft.css";
import axios from "axios";
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
	Badge,
} from "@mui/material";
import { Modal } from "antd";

const ConsultLeft = ({ userData }) => {
	const [users, setUsers] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	useEffect(() => {
		fetchUsers();
	}, []);

	// fetch users from backend
	const fetchUsers = async () => {
		try {
			const response = await axios.get("http://localhost:8000/auth/users");
			const filteredUsers = response.data.filter(
				(user) => user.userType === "agriprofessional"
			);

			// Sort the users array based on loginStatus
			const sortedUsers = [...filteredUsers].sort((a, b) => {
				if (a.loginStatus === "loggedIn" && b.loginStatus !== "loggedIn") {
					return -1; // a comes before b
				} else if (
					a.loginStatus !== "loggedIn" &&
					b.loginStatus === "loggedIn"
				) {
					return 1; // b comes before a
				} else {
					return 0; // no change in order
				}
			});

			setUsers(sortedUsers);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			fetchUsers();
		}, 1000);

		return () => clearInterval(interval);
	}, [users]);

	const handleModalOpen = (id) => {
		setIsModalOpen(true);
	};

	useEffect(() => {
		if (selectedUser) {
			const interval = setInterval(() => {
				fetchUsers();
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [selectedUser]);

	const getTimeLabel = (time) => {
		const currentTime = new Date();
		const date = new Date(time);

		const timeDiff = currentTime - date;
		const secondsDiff = Math.floor(timeDiff / 1000);
		const minutesDiff = Math.floor(secondsDiff / 60);
		const hoursDiff = Math.floor(minutesDiff / 60);
		const daysDiff = Math.floor(hoursDiff / 24);

		if (daysDiff === 0) {
			if (hoursDiff === 0) {
				if (minutesDiff === 0) {
					return `${secondsDiff} seconds ago`;
				}
				return `${minutesDiff} minutes ago`;
			}
			return `${hoursDiff} hours ago`;
		} else if (daysDiff === 1) {
			return "Yesterday";
		} else {
			const options = {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				hour12: false,
			};
			return date.toLocaleString("en-US", options);
		}
	};

	return (
		<div className="CLeft">
			<h3>Agri-Professionals</h3>
			<div className="CLeftContainer">
				{users.map((item) => (
					<Card className="CLeftCard" key={item.id}>
						<CardActionArea
							className="CLeftCardActionArea"
							onClick={() => {
								handleModalOpen(item.id);
								setSelectedUser(item);
							}}
						>
							<div className="CLeftCardAction">
								<CardMedia
									className="CLeftCardMedia"
									component="img"
									alt={item.name}
									image={
										item.profilePicture
											? item.profilePicture
											: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
									}
								/>
								<CardContent
									className="CLeftCardContent"
									sx={{ padding: "0px" }}
								>
									<div className="CLeftCardText">
										<Typography variant="subtitle1" component="span">
											{item.name === userData.name ? "You" : item.name}
										</Typography>
										<Typography
											variant="body2"
											component="p"
											style={{ color: "gray", textTransform: "capitalize" }}
										>
											{item.userType}
										</Typography>
									</div>
								</CardContent>
								<div className="CLeftCardStatus">
									{item.loginStatus === "loggedIn" ? (
										<Typography
											variant="body2"
											component="p"
											className="CLeftCardBadgeText Online"
										>
											Online
										</Typography>
									) : (
										<Typography
											variant="body2"
											component="p"
											className="CLeftCardBadgeText Offline"
										>
											{getTimeLabel(item.lastLogin)}
										</Typography>
									)}
								</div>
							</div>
						</CardActionArea>
					</Card>
				))}
			</div>
			{isModalOpen && (
				<Modal
					title={selectedUser && selectedUser.name}
					open={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					footer={null}
					centered
					width={400}
					user={selectedUser}
					closable={false}
				>
					<div className="CLeftModal">
						<div className="CLeftModalImage">
							{selectedUser && selectedUser.profilePicture ? (
								<img src={selectedUser.profilePicture} alt="profile" />
							) : (
								<img
									src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
									alt="profile"
								/>
							)}
						</div>
						<div className="CLeftModalDetails">
							<div className="CLeftModalDetailsItem">
								<div className="ModalHeader">
									<span>
										{selectedUser && selectedUser.name} (
										{selectedUser && selectedUser.username})
									</span>
									<div className="Badge">
										<Badge
											className={`CLeftCardBadge ${
												selectedUser && selectedUser.loginStatus === "loggedIn"
													? "CLeftCardBadgeActive"
													: ""
											}`}
											variant="dot"
											color={
												selectedUser && selectedUser.loginStatus === "loggedIn"
													? "success"
													: "error"
											}
											anchorOrigin={{
												vertical: "top",
												horizontal: "center",
											}}
										/>
									</div>
								</div>
								<span>{selectedUser && selectedUser.userType}</span>
								<div className="ModalBody">
									<div className="BusinessName">
										<i className="fas fa-briefcase"></i> &nbsp;
										<span>{selectedUser && selectedUser.businessName}</span>
									</div>
									<div className="BusinessType">
										<i className="fas fa-industry"></i> &nbsp;
										<span>{selectedUser && selectedUser.businessType}</span>
									</div>
									<div className="BusinessAddress">
										<i className="fas fa-map-marker-alt"></i> &nbsp;
										<span>{selectedUser && selectedUser.location}</span>
									</div>
									<div className="BusinessDescription">
										<i className="fas fa-info-circle"></i> &nbsp;
										<span>
											{selectedUser && selectedUser.businessDescription}
										</span>
									</div>
								</div>
							</div>
						</div>
						<button
							className="CLeftModalButton"
							onClick={() => setIsModalOpen(false)}
						>
							Close
						</button>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default ConsultLeft;
