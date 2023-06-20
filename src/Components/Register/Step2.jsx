import React, { useEffect } from "react";
import axios from "axios";
import { Modal, Spin } from "antd";

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
			await axios.post("http://localhost:4000/auth", registerData);

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
					<label htmlFor="name">Name</label>
					<input
						type="text"
						value={`${user.name} (${user.username})`}
						disabled
					/>
				</div>

				<div className="RegisterInput">
					<label htmlFor="email">Email</label>
					<input type="email" value={user.email} disabled />
				</div>
				<div
					className="RegisterInput"
					style={{
						width: "44%",
					}}
				>
					<label htmlFor="phone">Phone</label>
					<input type="text" value={user.phone} disabled />
				</div>
				<div className="RegisterInput">
					<label htmlFor="userType">User Type</label>
					<input type="text" value={user.userType} disabled />
				</div>
				<div className="RegisterInput">
					<label htmlFor="location">Location</label>
					<input type="text" value={user.location} disabled />
				</div>
				<div
					className="RegisterInput"
					style={{
						width: "44%",
					}}
				>
					<label htmlFor="password">Password</label>
					<input type="password" value={user.password} disabled />
				</div>
				{user.userType === "farmer" && (
					<>
						<div className="RegisterInput">
							<label htmlFor="farmingType">Farming Type</label>
							<input type="text" value={user.farmingType} disabled />
						</div>
						{user.farmingType === "crop" ? (
							<div className="RegisterInput">
								<label htmlFor="acreage">Acreage</label>
								<input
									type="text"
									name="acreage"
									value={
										user.acreage
											? user.acreage
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
													.concat(" acres")
											: ""
									}
									disabled
								/>
							</div>
						) : (
							<div className="RegisterInput">
								<label htmlFor="quantity">Quantity</label>
								<input
									type="text"
									name="quantity"
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
								/>
							</div>
						)}
					</>
				)}

				{(user.userType === "agribusiness" ||
					user.userType === "agriprofessional") && (
					<div className="RegisterInput">
						<label htmlFor="businessName">Business Name</label>
						<input type="text" value={user.businessName} disabled />
					</div>
				)}
				{(user.userType === "agribusiness" ||
					user.userType === "agriprofessional") && (
					<div
						className="RegisterInput"
						style={{
							width: "44%",
						}}
					>
						<label htmlFor="businessType">Business Type</label>
						<input type="text" value={user.businessType} disabled />
					</div>
				)}
				{(user.userType === "agribusiness" ||
					user.userType === "agriprofessional") && (
					<div
						className="RegisterInput"
						style={{
							width: "44%",
						}}
					>
						<label htmlFor="businessLocation">Business Location</label>
						<input type="text" value={user.businessLocation} disabled />
					</div>
				)}
				{user.userType === "agriprofessional" && (
					<div
						className="RegisterInput"
						style={{
							width: "44%",
						}}
					>
						<label htmlFor="professionalType">Professional Type</label>
						<input type="text" value={user.professionalType} disabled />
					</div>
				)}
				{(user.userType === "agribusiness" ||
					user.userType === "agriprofessional") && (
					<div
						className="RegisterInput"
						style={{
							width: "44%",
						}}
					>
						<label htmlFor="businessDescription">Business Description</label>
						<input type="text" value={user.description} disabled />
					</div>
				)}
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
