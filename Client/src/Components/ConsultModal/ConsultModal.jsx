import React, { useState } from "react";
import axios from "axios";
import { MenuItem, TextField } from "@mui/material";

import "./ConsultModal.css";

const initialState = {
	username: "",
	name: "",
	subject: "",
	farmingType: "",
	consultType: "",
	urgency: "",
	consultDescription: "",
	consultImage: "",
	refId: "",
};

const ConsultModal = ({ modalClose, userData }) => {
	const [consultInfo, setConsultInfo] = useState({
		...initialState,
		username: userData?.username || "",
		name: userData?.name || "",
		refId: userData?._id || "",
	});

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [consultImage, setConsultImage] = useState("");
	const [consultImagePreview, setConsultImagePreview] = useState("");
	const [consultImageUploadMessage, setConsultImageUploadMessage] =
		useState("");
	const [consultImageUploadError, setConsultImageUploadError] = useState("");
	const [consultImageUploadSuccess, setConsultImageUploadSuccess] =
		useState("");
	const [consultImageUploadProgress, setConsultImageUploadProgress] =
		useState(0);
	const [submittingConsult, setSubmittingConsult] = useState(false);
	const [submittedConsult, setSubmittedConsult] = useState(false);

	const handleChange = (e) => {
		setConsultInfo((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const handleConsultSubmit = async (e) => {
		e.preventDefault();

		try {
			setSubmittingConsult(true);

			await axios.post(
				"https://agrisolve-techsupport254.vercel.app/consults/consults",
				consultInfo
			);

			setConsultInfo(initialState);
			setTimeout(() => {
				setSubmittingConsult(false);
			}, 3000);

			setSuccessMessage("Consult submitted successfully");

			setTimeout(() => {
				setSubmittedConsult(true);
				setSuccessMessage("");
				modalClose();
			}, 3000);
		} catch (error) {
			setErrorMessage(
				`An error occurred while submitting the consult\n${error.message}. Please try again later`
			);

			setTimeout(() => {
				setErrorMessage("");
			}, 3000);
		}
	};

	const handleConsultImageUpload = (e) => {
		// Upload consult image logic
	};

	return (
		<div className="ConsultModal">
			<div className="ConsultModalContainer">
				<div className="ConsultsOnline"></div>
				<form className="ConsultsModalLeft">
					<div className="ConsultRow">
						<TextField
							label="Subject"
							variant="outlined"
							name="subject"
							id="subject"
							fullWidth
							color="success"
							value={consultInfo.subject}
							onChange={handleChange}
							size="small"
						/>
					</div>
					<div className="ConsultRow">
						<TextField
							label="Farming Type"
							variant="outlined"
							name="farmingType"
							id="farmingType"
							fullWidth
							color="success"
							value={consultInfo.farmingType}
							onChange={handleChange}
							size="small"
							select
							SelectProps={{
								value: consultInfo.farmingType,
								onChange: handleChange,
							}}
						>
							<MenuItem value="Dairy">Livestock</MenuItem>
							<MenuItem value="Poultry">Poultry</MenuItem>
							<MenuItem value="Crops">Crops</MenuItem>
							<MenuItem value="Other">Other</MenuItem>
						</TextField>
					</div>
					<div className="ConsultRow">
						<TextField
							label="Consult Type"
							variant="outlined"
							name="consultType"
							id="consultType"
							fullWidth
							color="success"
							value={consultInfo.consultType}
							onChange={handleChange}
							size="small"
							select
						>
							<MenuItem value="Online">Online</MenuItem>
							<MenuItem value="Physical">Physical</MenuItem>
						</TextField>
					</div>
					<div className="ConsultRow">
						<TextField
							label="Urgency"
							variant="outlined"
							name="urgency"
							id="urgency"
							fullWidth
							color="success"
							value={consultInfo.urgency}
							size="small"
							select
							SelectProps={{
								value: consultInfo.urgency,
								onChange: handleChange,
							}}
						>
							<MenuItem value="Low">Low</MenuItem>
							<MenuItem value="Medium">Medium</MenuItem>
							<MenuItem value="High">High</MenuItem>
						</TextField>
					</div>
				</form>
				<div className="ConsultsModalRight">
					<div className="ConsultRow">
						<TextField
							label="Consult Description"
							variant="outlined"
							name="consultDescription"
							id="consultDescription"
							fullWidth
							multiline
							rows={4}
							color="success"
							value={consultInfo.consultDescription}
							onChange={handleChange}
							size="small"
						/>
					</div>
					{/* 
					<div className="ConsultRow">
						<span>Upload Image(s):</span>
						<input
							type="file"
							name="consultImage"
							id="consultImage"
							onChange={handleConsultImageUpload}
						/>
					</div> */}
				</div>
			</div>
			<div className="ConsultButton">
				<button
					type="submit"
					className="ConsultSubmitButton"
					onClick={handleConsultSubmit}
				>
					{submittingConsult ? (
						<>
							<i className="fas fa-spinner fa-spin"></i>&nbsp;
							<span>Submitting</span>
						</>
					) : submittedConsult ? (
						<>
							<i className="fas fa-check"></i> &nbsp; Submitted
						</>
					) : (
						"Submit"
					)}
				</button>
			</div>
			{successMessage && (
				<div
					style={{
						color: "green",
						padding: "1rem",
						marginTop: "1rem",
					}}
				>
					{successMessage}
				</div>
			)}
			{errorMessage && (
				<div
					style={{
						color: "red",
						padding: "1rem",
						marginTop: "1rem",
					}}
				>
					{errorMessage}
				</div>
			)}
		</div>
	);
};

export default ConsultModal;
