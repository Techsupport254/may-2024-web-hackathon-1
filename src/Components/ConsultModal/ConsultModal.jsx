import React, { useState } from "react";
import axios from "axios";

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

			await axios.post("http://localhost:4000/consults/consults", consultInfo);

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
						<span>Consult Subject:</span>
						<input
							type="text"
							placeholder="Enter a subject related to your concern"
							name="subject"
							id="consultSubject"
							value={consultInfo.subject}
							onChange={handleChange}
						/>
					</div>
					<div className="ConsultRow">
						<span>Farming Type:</span>
						<select
							name="farmingType"
							id="farmingType"
							value={consultInfo.farmingType}
							onChange={handleChange}
						>
							<option>Select type of farming</option>
							<option value="Dairy">Livestock</option>
							<option value="Poultry">Poultry</option>
							<option value="Crops">Crops</option>
							<option value="Other">Other</option>
						</select>
					</div>
					<div className="ConsultRow">
						<span>Consult Type:</span>
						<select
							name="consultType"
							id="consultType"
							value={consultInfo.consultType}
							onChange={handleChange}
						>
							<option>Select type of consult</option>
							<option value="Online">Online</option>
							<option value="Offline">Physical</option>
						</select>
					</div>
					<div className="ConsultRow">
						<span>Urgency:</span>
						<select
							name="urgency"
							id="urgency"
							value={consultInfo.urgency}
							onChange={handleChange}
						>
							<option>Select urgency level</option>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>
				</form>
				<div className="ConsultsModalRight">
					<div className="ConsultRow">
						<span>Consult Description:</span>
						<textarea
							name="consultDescription"
							id="consultDescription"
							cols="30"
							rows="10"
							placeholder="Enter a description of your concern"
							value={consultInfo.consultDescription}
							onChange={handleChange}
						></textarea>
					</div>

					<div className="ConsultRow">
						<span>Upload Image(s):</span>
						<input
							type="file"
							name="consultImage"
							id="consultImage"
							onChange={handleConsultImageUpload}
						/>
					</div>
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
