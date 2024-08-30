import { Button, TextField } from "@mui/material";
import React from "react";
import "./PasswordDetails.css";

const PasswordDetails = () => {
	return (
		<div className="PasswordDetails">
			<span>Change Password</span>
			<p>
				Change your password to keep your account secure. We recommend using a
				strong password that you're not using elsewhere.
			</p>
			<div className="DetailsItem">
				<div className="PasswordItem">
					<TextField
						label="Current Password"
						variant="outlined"
						color="success"
						fullWidth
						size="small"
						type="password"
					/>
				</div>
				<div className="PasswordItem">
					<TextField
						label="New Password"
						variant="outlined"
						color="success"
						fullWidth
						size="small"
						type="password"
					/>
					<TextField
						label="Confirm Password"
						variant="outlined"
						color="success"
						fullWidth
						size="small"
						type="password"
					/>
				</div>
				<Button
					variant="contained"
					size="small"
					style={{
						background: "var(--bg-color)",
						padding: "10px 30px",
						"&:hover": {
							color: "var(--bg-color)",
							border: "1px solid var(--bg-color)",
						},
					}}
				>
					Change Password
				</Button>
			</div>
		</div>
	);
};

export default PasswordDetails;
