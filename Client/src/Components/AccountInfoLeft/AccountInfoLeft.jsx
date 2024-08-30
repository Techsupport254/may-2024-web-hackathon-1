import React from "react";
import PropTypes from "prop-types";
import { Image } from "cloudinary-react";

import {
	InputAdornment,
	Switch,
	TextField,
	Snackbar,
	Alert,
	styled,
	Button,
} from "@mui/material";
const IOSSwitch = styled((props) => (
	<Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	"& .MuiSwitch-switchBase": {
		padding: 0,
		margin: 2,
		transitionDuration: "300ms",
		"&.Mui-checked": {
			transform: "translateX(16px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
				opacity: 1,
				border: 0,
			},
			"&.Mui-disabled + .MuiSwitch-track": {
				opacity: 0.5,
			},
		},
		"&.Mui-focusVisible .MuiSwitch-thumb": {
			color: "#33cf4d",
			border: "6px solid #fff",
		},
		"&.Mui-disabled .MuiSwitch-thumb": {
			color:
				theme.palette.mode === "light"
					? theme.palette.grey[100]
					: theme.palette.grey[600],
		},
		"&.Mui-disabled + .MuiSwitch-track": {
			opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
		},
	},
	"& .MuiSwitch-thumb": {
		boxSizing: "border-box",
		width: 22,
		height: 22,
	},
	"& .MuiSwitch-track": {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
		opacity: 1,
		transition: theme.transitions.create(["background-color"], {
			duration: 500,
		}),
	},
}));

const AccountInfoLeft = ({
	userData,
	profilePicture,
	handleUpdateProfilePic,
	handleFileChange,
	fileInputRef,
	uploading,
}) => {
	return (
		<div className="AccountInfoLeft">
			<h4>Account Overview</h4>
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

			<p>{userData?.name}</p>
			<span>{userData?.username}</span>
			<p>{userData?.userType}</p>
			<span>
				Joined <i className="fas fa-calendar-alt"></i>{" "}
				{userData?.created_at
					? new Date(userData?.created_at).toDateString()
					: "N/A"}
			</span>
			<div className="ProfileMore">
				<div className="ProfileMoreItem">
					<p>
						{userData?.verificationStatus === "verified"
							? "Verified"
							: "Verify"}
					</p>
					<IOSSwitch
						checked={userData?.verificationStatus === "verified" ? true : false}
						disabled
						inputProps={{ "aria-label": "controlled" }}
					/>
				</div>
				<div className="ProfileBtns">
					<Button variant="contained" color="error" size="small">
						Delete Account
					</Button>
					<small>
						<i className="fas fa-exclamation-triangle"></i> Deleting your
						account is irreversible and all your data will be lost.
					</small>
				</div>
			</div>
		</div>
	);
};

export default AccountInfoLeft;

// props validation
AccountInfoLeft.propTypes = {
	userData: PropTypes.object.isRequired,
	profilePicture: PropTypes.string.isRequired,
	handleUpdateProfilePic: PropTypes.func.isRequired,
	handleFileChange: PropTypes.func.isRequired,
	fileInputRef: PropTypes.object.isRequired,
	uploading: PropTypes.bool.isRequired,
};
