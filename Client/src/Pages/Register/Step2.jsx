import "./Register.css";
import React, { useEffect } from "react";
import axios from "axios";
import { Modal, Spin } from "antd";
import { TextField } from "@mui/material";

const Step2 = ({ onNextStep }) => {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState("");

	const [user, setUser] = React.useState({
		name: "",
		username: "",
		email: "",
		phone: "",
		userType: "",
		location: "",
		password: "",
		farmingType: "",
		businessName: "",
		businessType: "",
		businessLocation: "",
		professionalType: "",
		businessDescription: "",
	});

	useEffect(() => {
		const storedData = localStorage.getItem("formData");
		const storedData1 = localStorage.getItem("formData1");
		const parsedData = storedData ? JSON.parse(storedData) : {};
		const parsedData1 = storedData1 ? JSON.parse(storedData1) : {};

		setUser({
			...parsedData,
			...parsedData1,
		});

		setLoading(false);
	}, []);

	const handleContinue = async (e) => {
		e.preventDefault();

		try {
			const registerData = {
				name: user.name,
				username: user.username,
				email: user.email,
				phone: user.phone,
				userType: user.userType,
				location: user.location,
				password: user.password,
				farmingType: user.farmingType,
				businessName: user.businessName,
				businessType: user.businessType,
				businessLocation: user.businessLocation,
				professionalType: user.professionalType,
				businessDescription: user.businessDescription,
			};

			setLoading(true); // Show the loading indicator

			// Simulate an asynchronous operation
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Make an HTTP request to your backend API to register the user
			await axios.post(
				"https://agrisolve.vercel.app/auth",
				registerData
			);

			localStorage.removeItem("formData1");

			if (typeof onNextStep === "function") {
				onNextStep();
			}
		} catch (err) {
			console.log(err);
			setError(err.response.data.message);

			// Reset the error after 2 seconds
			setTimeout(() => {
				setError("");
			}, 3000);
		} finally {
			// Set the loading state to false after 2 seconds
			setTimeout(() => {
				setLoading(false);
			}, 2000);
		}
	};

	return (
		<div className="RegisterLeftCont">
			<p>Please review your details before completing the registration</p>
			<form>
				<div className="RegisterInput">
					<TextField
						label="Name"
						variant="outlined"
						value={`${user.name} (${user.username})`}
						disabled
						size="small"
						fullWidth
					/>
					<TextField
						label="Email"
						variant="outlined"
						value={user.email}
						disabled
						size="small"
						fullWidth
					/>
				</div>

				<div className="RegisterInput">
					<TextField
						label="Phone"
						variant="outlined"
						value={user.phone}
						disabled
						size="small"
						fullWidth
					/>
					<TextField
						label="User Type"
						variant="outlined"
						value={user.userType}
						disabled
						size="small"
						fullWidth
					/>
				</div>
				<div className="RegisterInput">
					<TextField
						label="Location"
						variant="outlined"
						value={user.location}
						disabled
						size="small"
						fullWidth
					/>
					<TextField
						label="Password"
						variant="outlined"
						value={user.password}
						disabled
						size="small"
						fullWidth
					/>
				</div>
				<div className="RegisterInput"></div>
				{user.userType === "farmer" && (
					<>
						<div className="RegisterInput">
							<TextField
								label="Farming Type"
								variant="outlined"
								value={user.farmingType}
								disabled
								size="small"
								fullWidth
							/>
							{user.farmingType === "crop" ? (
								<div className="RegisterInput">
									<TextField
										label="Acreage"
										variant="outlined"
										value={
											user.acreage
												? user.acreage
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
														.concat(" acres")
												: ""
										}
										disabled
										size="small"
										fullWidth
									/>
								</div>
							) : (
								<div className="RegisterInput">
									<TextField
										label="Quantity"
										variant="outlined"
										value={
											user.quantity
												? user.quantity
														.toString()
														.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
														.concat(
															user.farmingType === "poultry"
																? " birds"
																: " animals"
														)
												: ""
										}
										disabled
										size="small"
										fullWidth
									/>
								</div>
							)}
						</div>
					</>
				)}
				<div className="RegisterInput">
					{(user.userType === "agribusiness" ||
						user.userType === "agriprofessional") && (
						<div className="RegisterInput">
							<TextField
								label="Business Name"
								variant="outlined"
								value={user.businessName}
								disabled
								size="small"
								fullWidth
							/>
							{(user.userType === "agribusiness" ||
								user.userType === "agriprofessional") && (
								<div className="RegisterInput">
									<TextField
										label="Business Type"
										variant="outlined"
										value={user.businessType}
										disabled
										size="small"
										fullWidth
									/>
								</div>
							)}
						</div>
					)}
				</div>
				<div className="RegisterInput">
					{(user.userType === "agribusiness" ||
						user.userType === "agriprofessional") && (
						<div className="RegisterInput">
							<TextField
								label="Business Location"
								variant="outlined"
								value={user.businessLocation}
								disabled
								fullWidth
								size="small"
							/>
						</div>
					)}
				</div>
				{user.userType === "agriprofessional" && (
					<div className="RegisterInput">
						<TextField
							label="Professional Type"
							variant="outlined"
							value={user.professionalType}
							disabled
							size="small"
							fullWidth
						/>
					</div>
				)}
				<div className="RegisterInput">
					{(user.userType === "agribusiness" ||
						user.userType === "agriprofessional") && (
						<div className="RegisterInput">
							<TextField
								label="Business Description"
								variant="outlined"
								value={user.businessDescription}
								disabled
								size="small"
								multiline
								rows={4}
								fullWidth
							/>
						</div>
					)}
				</div>
			</form>
			<div className="BottomBtn">
				<button className="RegisterBtn" onClick={handleContinue}>
					Finish Registration <i className="fas fa-arrow-right"></i>
				</button>
			</div>
			{loading && (
				<Modal
					open={true}
					disableBackdropClick={true}
					wrapClassName="LoadingModal"
					footer={null}
					closeIcon={null}
					closable={false}
				>
					{!error && (
						<>
							<div className="Spinner">
								<Spin
									size="large"
									indicator={
										<i
											className="fas fa-spinner fa-spin"
											style={{ fontSize: 30, color: "#000", margin: 10 }}
										/>
									}
								/>
							</div>
							<p className="LoadingText">Finishing Registration...</p>
						</>
					)}
					{error && (
						<>
							<div
								className="ErrorContainer"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									flexDirection: "column",
									marginBottom: 20,
								}}
							>
								<i
									className="fas fa-exclamation-circle"
									style={{
										fontSize: 30,
										color: "#f00",
										marginBottom: 10,
									}}
								></i>
								<p
									className="ErrorText"
									style={{
										textAlign: "center",
										fontSize: 16,
										fontWeight: 500,
										marginBottom: 0,
									}}
								>
									{error}
								</p>
							</div>
							<button
								className="RetryBtn"
								style={{
									width: "100%",
									padding: 10,
									border: "none",
									borderRadius: 5,
									backgroundColor: "#f00",
									color: "#fff",
									fontSize: 16,
									fontWeight: 500,
									cursor: "pointer",
								}}
								onClick={() => setLoading(false)}
							>
								Retry
							</button>
						</>
					)}
				</Modal>
			)}
		</div>
	);
};

export default Step2;
