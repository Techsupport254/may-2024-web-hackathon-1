import React, { useState, useEffect } from "react";
import "./TopLeft.css";
import { motion } from "framer-motion";
import { Badge, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Modal } from "antd";

const TopLeft = ({ userData }) => {
	const [active, setActive] = useState(null);
	const [visible, setVisible] = useState(false);
	const [verified, setVerified] = useState(false);

	const closeModal = () => {
		setActive(null);
		setVisible(false);
	};

	useEffect(() => {
		if (userData.length > 0) {
			setVerified(userData[0].verificationStatus === "verified");
		}
	}, [userData]);

	const activeUserData = userData.find((item) => item._id === active);

	const getTimeLabel = (time) => {
		const date = new Date(time);
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
	};

	return (
		<div className="TopLeft">
			<h3>{verified ? "Verified" : "Unverified"} Agriprofessionals</h3>
			{userData.length === 0 ? (
				<div className="ErrorLoading">
					<i className="fas fa-exclamation-triangle"></i>
					<p>Could not load data</p>
				</div>
			) : (
				userData.map((item) => (
					<motion.div
						className={`TopLeftItem ${active === item._id ? "Active" : ""}`}
						layout
						onClick={() => {
							setActive(item._id);
							setVisible(true);
						}}
						key={item._id}
					>
						<motion.div layout className="Image">
							<img
								src={
									item.profilePicture
										? `https://agrisolve-techsupport254.vercel.app/uploads/${
												item.profilePicture
										  }?${Date.now()}`
										: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
								}
								alt={item.name}
							/>
						</motion.div>
						<motion.div layout className="Title">
							<span>{item.name}</span>
							<span>{item.location}</span>
						</motion.div>
						<motion.div layout className="CLeftCardStatus1">
							<Badge
								style={{
									height: "1rem",
									width: "1rem",
									padding: "0",
									margin: "0",
								}}
								className={`CLeftCardBadge ${
									item.loginStatus === "loggedIn" ? "CLeftCardBadgeActive" : ""
								}`}
								variant="dot"
								color={item.loginStatus === "loggedIn" ? "success" : "error"}
								anchorOrigin={{
									vertical: "top",
									horizontal: "center",
								}}
							/>
							<Typography
								variant="body2"
								component="p"
								className="CLeftCardBadgeText1"
							>
								{item.loginStatus === "loggedIn"
									? "Online"
									: getTimeLabel(item.lastLogin)}
							</Typography>
						</motion.div>
					</motion.div>
				))
			)}
			{activeUserData && (
				<Modal
					open={visible}
					onCancel={closeModal}
					footer={null}
					centered
					className="LeftModalContainer"
				>
					<div className="LeftModal">
						<div className="LeftModalContent">
							<div className="ModalImage">
								<img
									src={
										activeUserData.profilePicture
											? `https://agrisolve-techsupport254.vercel.app/uploads/${
													activeUserData.profilePicture
											  }?${Date.now()}`
											: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
									}
									alt={activeUserData.name}
								/>
							</div>
							<h4 style={{ textTransform: "capitalize" }}>
								{activeUserData.name} ({activeUserData.username})
								{verified && (
									<i
										style={{ color: "green", marginLeft: "5px" }}
										className="fas fa-circle-check"
									></i>
								)}
							</h4>
							<h5>{activeUserData.location}</h5>
							<p>{activeUserData.description}</p>
							<div className="Business">
								<h5 style={{ textTransform: "capitalize" }}>
									{activeUserData.businessName} ({activeUserData.businessType})
								</h5>
								<span>{activeUserData.businessLocation}</span>
								<p>{activeUserData.businessDescription}</p>
							</div>
							<button onClick={closeModal}>Close</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default TopLeft;
