import React, { useState, useEffect } from "react";
import "./TopLeft.css";
import { motion } from "framer-motion";
import axios from "axios";
import { Badge, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Modal } from "antd";

const TopLeft = ({ userData, isLoggedin }) => {
	const [active, setActive] = useState(null);
	const [visible, setVisible] = useState(false);
	const [verified, setVerified] = useState(false);
	const [isOnline, setIsOnline] = useState(false);

	const closeModal = () => {
		setActive(null);
		setVisible(false);
	};

	useEffect(() => {
		if (userData.length > 0) {
			setVerified(userData[0].verificationStatus === "verified");
		}
	}, [userData]);

	// check if the data is loaded or not
	if (userData.length === 0) {
		return (
			<div>
				<i className="fas fa-spinner fa-spin"></i>
			</div>
		);
	}

	useEffect(() => {
		// set the active user data if the user is logged in
		if (isLoggedin) {
			const activeUser = userData.find((user) => user._id === isLoggedin);
			setIsOnline(activeUser ? activeUser.isOnline : true);
		}
	}, [isLoggedin, userData]);

	const activeUserData = userData.find((item) => item._id === active);

	return (
		<div className="TopLeft">
			<h3>{verified ? "Verified" : "Unverified"} Agriprofessionals</h3>
			{userData.map((item) => (
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
								item.image ||
								"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
							}
							alt={item.name}
						/>
					</motion.div>
					<motion.div layout className="Title">
						<span>{item.name}</span>
						<span>{item.location}</span>
					</motion.div>
					<div
						className="CLeftCardStatus"
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "1.8rem",
							width: "3rem",
						}}
					>
						<Badge
							style={{
								borderRadius: "50%",
								height: "1rem",
								width: "1rem",
								marginRight: "0.5rem",
							}}
							className={`CLeftCardBadge ${
								isOnline ? "CLeftCardBadgeActive" : ""
							}`}
							variant="dot"
							color={isOnline ? "success" : "error"}
							anchorOrigin={{
								vertical: "top",
								horizontal: "center",
							}}
						/>
						{!isOnline && (
							<Typography
								variant="body2"
								component="p"
								className="CLeftCardBadgeText"
							>
								{item.lastActive}
							</Typography>
						)}
					</div>
					<motion.div className="Icon">
						{active === item._id ? (
							<i className="fas fa-caret-up"></i>
						) : (
							<i className="fas fa-caret-down"></i>
						)}
					</motion.div>
				</motion.div>
			))}
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
										activeUserData.image ||
										"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
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
