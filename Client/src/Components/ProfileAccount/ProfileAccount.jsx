import React, { useState, useRef, useContext } from "react";
import "./ProfileAccount.css";
import { Badge, MenuItem, Switch, TextField } from "@mui/material";
import axios from "axios";
import { Image } from "cloudinary-react";
import { ApiContext } from "../../Context/ApiProvider";

const ProfileAccount = () => {
	const { userData } = useContext(ApiContext);

	console.log(userData);

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

			console.log("Update Response:", updateResponse.data);

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

			console.log("Update Response:", res.data);

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

	console.log(userData);
	const renderAccountInfo = () => {
		return (
			<div className="AccountInfo">
				<div className="AccountInfoContainer">
					<div className="AccountInfoLeft">
						<div className="ProfilePic">
							<div className={`Pic ${uploading ? "Uploading" : ""}`}>
								<Image
									cloudName="agrisolve"
									publicId={
										profilePicture ||
										"https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
									}
									alt="Profile"
									style={{
										filter: uploading ? "blur(1px)" : "none",
										transition: "all 0.5s ease",
									}}
								/>
							</div>
							<div className="UpdatePhoto" onClick={handleUpdateProfilePic}>
								<i className="fa fa-camera"></i>
								<h1>Update photo</h1>
							</div>
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
							<span>({userData?.username})</span>
							<br />
							<span>
								Joined on <i className="fas fa-calendar-alt"></i>{" "}
								{userData?.created_at
									? new Date(userData?.created_at).toDateString()
									: "N/A"}
							</span>
						</p>
						<h5>{userData?.userType}</h5>
						<div className="ProfileMore">
							<div className="ProfileMoreItem">
								{userData?.verificationStatus !== "verified" ? (
									<>
										<p>Verify</p>
										<Switch
											checked={false}
											disabled
											inputProps={{ "aria-label": "controlled" }}
										/>
									</>
								) : (
									<>
										<p>Verified</p>
										<Switch
											checked
											disabled
											inputProps={{ "aria-label": "controlled" }}
										/>
									</>
								)}
							</div>
							<div className="ProfileBtns">
								<button>Delete Account</button>
							</div>
						</div>
					</div>
					<div className="AccountInfoRight">
						<div className="AccountInfoItem">
							<TextField
								label="Name"
								variant="outlined"
								value={accountInfo.name}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, name: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
							<TextField
								label="Email"
								variant="outlined"
								value={accountInfo.email}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, email: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
						</div>
						<div className="AccountInfoItem">
							<TextField
								label="Phone"
								variant="outlined"
								value={accountInfo.phone}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, phone: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
							<TextField
								label="Username"
								variant="outlined"
								value={accountInfo.username}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, username: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
						</div>
						<div className="AccountInfoItem">
							<TextField
								label="Address"
								variant="outlined"
								value={accountInfo.address}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, address: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
							<TextField
								label="User Type"
								variant="outlined"
								value={accountInfo.userType}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, city: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
								select
								defaultValue={accountInfo.userType}
							>
								<MenuItem value="agriprofessional">Agriprofessional</MenuItem>
								<MenuItem value="agribusiness">Agribusiness</MenuItem>
								<MenuItem value="farmer">Farmer</MenuItem>
							</TextField>
						</div>
						<div className="AccountInfoItem">
							<TextField
								label="Business Name"
								variant="outlined"
								value={accountInfo.businessName}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, state: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
							<TextField
								label="Business Location"
								variant="outlined"
								value={accountInfo.businessLocation}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, country: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
							/>
						</div>
						<div className="AccountInfoItem">
							<TextField
								label="Business Description"
								variant="outlined"
								value={accountInfo.businessDescription}
								disabled={edit}
								onChange={(e) =>
									setAccountInfo({ ...accountInfo, country: e.target.value })
								}
								color="success"
								fullWidth
								size="small"
								multiline
								rows={4}
							/>
						</div>
						<div className="ChangeBtn">
							{edit ? (
								<>
									<button className="SaveChanges" onClick={handleSave}>
										Save Changes
									</button>
									<button
										className="CancelChanges"
										onClick={() => setEdit(false)}
									>
										Cancel
									</button>
								</>
							) : (
								<button className="EditProfile" onClick={() => setEdit(true)}>
									Edit Profile
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	};

	return <div className="ProfileAccount">{renderAccountInfo()}</div>;
};

export default ProfileAccount;
