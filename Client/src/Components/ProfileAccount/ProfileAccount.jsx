import React, { useState, useRef } from "react";
import "./ProfileAccount.css";
import { Badge } from "@mui/material";
import axios from "axios";

const ProfileAccount = ({ userData }) => {
	const [edit, setEdit] = useState(true);
	const [uploading, setUploading] = useState(false);

	const [accountInfo, setAccountInfo] = useState({
		name: userData?.name || "",
		email: userData?.email || "",
		phone: userData?.phone || "",
		address: userData?.location || "",
		password: "**********",
	});

	const [profilePicture, setProfilePicture] = useState(
		userData?.profilePicture
	);

	const handleToggleEdit = () => {
		setEdit(!edit);
	};

	const fileInputRef = useRef(null);

	const fetchUpdatedUserData = async () => {
		// Fetch the updated user data from the server and set it to the state
		try {
			const res = await axios.get(
				`https://agrisolve-techsupport254.vercel.app/auth/user/${userData.email}`
			);
			setAccountInfo({
				name: res.data.name,
				email: res.data.email,
				phone: res.data.phone,
				address: res.data.location,
				password: "**********", // You might want to update this with the actual password if available
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpdateProfilePic = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (event) => {
		const file = event.target.files[0];

		setUploading(true);

		// Create a new FormData object
		const formData = new FormData();
		formData.append("image", file);

		try {
			// Update the profile pic
			const res = await axios.post(
				"https://agrisolve-techsupport254.vercel.app/api/images",
				formData
			);
			console.log(res);

			// Update the user data
			const patchRes = await axios.patch(
				`https://agrisolve-techsupport254.vercel.app/auth/user/${userData.email}`,
				{
					profilePicture: res.data.image.filename,
				}
			);
			console.log(patchRes);

			// Fetch the updated user data after the image is uploaded
			await fetchUpdatedUserData();

			// Update the profile picture state with the new URL
			setProfilePicture(res.data.image.filename);

			setTimeout(() => {
				setUploading(false);
			}, 3000);
		} catch (err) {
			console.log(err);
		}

		console.log(file);
	};

	const renderAccountInfo = () => {
		return (
			<div className="AccountInfo">
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
							<div
								className={`Pic ${uploading ? "Uploading" : ""}`}
								style={{
									transition: "all 0.5s ease",
								}}
							>
								<img
									src={
										profilePicture
											? `https://agrisolve-techsupport254.vercel.app/uploads/${profilePicture}?${Date.now()}`
											: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
									}
									alt="Profile"
									style={{
										filter: uploading ? "blur(1px)" : "none",
										transition: "all 0.5s ease",
									}}
								/>
							</div>
							<Badge
								badgeContent={<i className="fas fa-camera"></i>}
								color="primary"
								overlap="circular"
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "right",
								}}
								className="ProfilePicBadge"
								onClick={handleUpdateProfilePic}
							></Badge>
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
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
