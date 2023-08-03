import React, { useState, useRef } from "react";
import "./ProfileAccount.css";
import { Badge } from "@mui/material";
import axios from "axios";
import cloudinary from "cloudinary-core";

const cloudinaryCore = new cloudinary.Cloudinary({
	cloud_name: "YOUR_CLOUD_NAME",
});

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

		setUploading(true);

		try {
			// Upload the image to Cloudinary
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // Replace "YOUR_UPLOAD_PRESET" with your actual Cloudinary upload preset name
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, // Replace "YOUR_CLOUD_NAME" with your actual Cloudinary cloud name
				{
					method: "POST",
					body: formData,
				}
			);

			const data = await response.json();

			// Update the user data with the Cloudinary image URL
			const patchRes = await axios.patch(
				`https://agrisolve-techsupport254.vercel.app/auth/user/${userData.email}`,
				{
					profilePicture: data.secure_url,
				}
			);
			console.log(patchRes);

			// Fetch the updated user data after the image is uploaded
			await fetchUpdatedUserData();

			// Update the profile picture state with the new URL
			setProfilePicture(data.secure_url);

			setTimeout(() => {
				setUploading(false);
			}, 3000);
		} catch (err) {
			console.log(err);
		}
	};

	const renderAccountInfo = () => {
		return (
			<div className="AccountInfo">
				{/* ... Rest of the component code ... */}
			</div>
		);
	};

	return <div className="ProfileAccount">{renderAccountInfo()}</div>;
};

export default ProfileAccount;
