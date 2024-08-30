import React, { useState, useRef, useContext } from "react";
import "./ProfileAccount.css";
import { Badge, Button, MenuItem, Switch, TextField } from "@mui/material";
import axios from "axios";
import { ApiContext } from "../../Context/ApiProvider";

import AccountInfoLeft from "../AccountInfoLeft/AccountInfoLeft";
import AccountInfoRight from "../AccountInfoRight/AccountInfoRight";

const ProfileAccount = () => {
	const { userData } = useContext(ApiContext);
	const [edit, setEdit] = useState(false);
	const [uploading, setUploading] = useState(false);

	const [accountInfo, setAccountInfo] = useState({
		name: userData?.name || "",
		email: userData?.email || "",
		phone: userData?.phone || "",
		username: userData?.username || "",
		address: userData?.location || "",
		userType: userData?.userType || "",
		businessName: userData?.businessName || "",
		businessType: userData?.businessType || "",
		businessLocation: userData?.businessLocation || "",
		businessDescription: userData?.businessDescription || "",
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
				`http://localhost:8000/auth/user/${userData.email}`
			);
			setAccountInfo({
				name: res.data.name,
				email: res.data.email,
				phone: res.data.phone,
				address: res.data.location,
				password: "**********",
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
		const CLOUD_NAME = __CLOUD_NAME__;
		const PRESET_NAME = __UPLOAD_PRESET__;
		setUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", PRESET_NAME);

			const uploadResponse = await axios.post(
				`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
				formData
			);

			setProfilePicture(uploadResponse.data.secure_url);

			const updateResponse = await axios.patch(
				`http://localhost:8000/auth/user/${userData?.email}`,
				{
					profilePicture: uploadResponse.data.secure_url,
				},
				{
					headers: {
						"x-auth-token": userData?.token,
					},
				}
			);

			setUploading(false);
		} catch (err) {
			console.error("Error:", err);
			setUploading(false);
		}
	};

	const handleUpdateAccountInfo = async () => {
		try {
			const res = await axios.patch(
				`http://localhost:8000/auth/user/${userData?.email}`,
				{
					name: accountInfo.name,
					email: accountInfo.email,
					phone: accountInfo.phone,
					location: accountInfo.address,
				},
				{
					headers: {
						"x-auth-token": userData?.token,
					},
				}
			);

			fetchUpdatedUserData();
		} catch (err) {
			console.log(err);
		}
	};

	const handleSave = () => {
		// TODO: Save the updated data to the server
		handleUpdateAccountInfo();
		setEdit(!edit);
	};

	const handleEdit = (e) => {
		setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value });
	};

	const renderAccountInfo = () => {
		return (
			<div className="AccountInfo">
				<AccountInfoLeft
					userData={userData}
					profilePicture={profilePicture}
					handleUpdateProfilePic={handleUpdateProfilePic}
					handleFileChange={handleFileChange}
					fileInputRef={fileInputRef}
					uploading={uploading}
				/>
				<AccountInfoRight
					accountInfo={accountInfo}
					edit={edit}
					handleEdit={handleEdit}
					handleSave={handleSave}
					handleToggleEdit={handleToggleEdit}
				/>
			</div>
		);
	};

	return <div className="ProfileAccount">{renderAccountInfo()}</div>;
};

export default ProfileAccount;
