import React, { useState } from "react";
import "./ProfileAccount.css";
import { Badge } from "@mui/material";

const ProfileAccount = ({
	userData,
	isLoggedin,
	shippingData,
	paymentData,
}) => {
	// log user data
	console.log(userData, isLoggedin, shippingData, paymentData);

	const [edit, setEdit] = useState(true);

	const [accountInfo, setAccountInfo] = useState({
		name: userData?.name || "",
		email: userData?.email || "",
		phone: userData?.phone || "",
		address: userData?.location || "",
		password: "**********",
	});

	const handleToggleEdit = () => {
		setEdit(!edit);
	};

	const handleUpdateProfilePic = () => {
		// change profile pic logic
	};

	console.log(shippingData, paymentData);
	const renderAccountInfo = () => {
		return (
			<div className="AccountInfo">
				<h4>Account Information</h4>
				<div className="AccountInfoContainer">
					<div className="AccountInfoLeft">
						<Badge
							badgeContent={
								edit ? (
									<i className="fas fa-edit"></i>
								) : (
									<i className="fas fa-check"></i>
								)
							}
							color="primary"
							overlap="circular"
							anchorOrigin={{
								vertical: "top",
								horizontal: "topRight",
							}}
							className="ProfileBadge"
							onClick={handleToggleEdit}
						></Badge>
						<div className="ProfilePic">
							<img
								src="https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
								alt="profile"
							/>
							<Badge
								badgeContent={<i className="fas fa-camera"></i>}
								color="primary"
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								className="ProfilePicBadge"
							></Badge>
						</div>

						<p>
							{userData?.name}
							<span>({userData.username})</span>
							<br />
							<span>
								Joined on <i className="fas fa-calendar-alt"></i>{" "}
								{userData.created_at
									? new Date(userData.created_at).toDateString()
									: "N/A"}
							</span>
						</p>
						<h5>
							<i className="fas fa-user-tag"></i>&nbsp;
							{userData?.userType}
						</h5>
						<div className="ProfileContent">
							<span>
								<i className="fas fa-store"></i>&nbsp;
								{userData?.businessName} &nbsp;&nbsp;|&nbsp;&nbsp;{" "}
								{userData?.businessType}
							</span>
							<h5>
								<i className="fas fa-map-marker-alt"></i>&nbsp;
								{userData?.businessLocation}
							</h5>

							<p>
								<i className="fas fa-info-circle"></i>&nbsp;
								{userData?.businessDescription}
							</p>
						</div>
					</div>
					<div className="AccountInfoRight">
						<div className="AccountInfoItem">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name="email"
								id="email"
								value={accountInfo.email}
								disabled={edit}
							/>
						</div>
						<div className="AccountInfoItem">
							<label htmlFor="phone">Phone</label>
							<input
								type="text"
								name="phone"
								id="phone"
								value={accountInfo.phone}
								disabled={edit}
							/>
						</div>
						<div className="AccountInfoItem">
							<label htmlFor="address">Address</label>
							<input
								type="text"
								name="address"
								id="address"
								value={accountInfo.address}
								disabled={edit}
							/>
						</div>
						<div className="AccountInfoItem">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								name="password"
								id="password"
								value={accountInfo.password}
								disabled={edit}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return <div className="ProfileAccount">{renderAccountInfo()}</div>;
};

export default ProfileAccount;
