import { Modal, Spin } from "antd";
import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";

const Step0 = ({ onNextStep }) => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [userType, setUserType] = useState("");
	const [location, setLocation] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			setLocation("Geolocation is not supported by this browser.");
		}
	};

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	// Check if the form is valid
	useEffect(() => {
		const isFormValid =
			name !== "" &&
			username !== "" &&
			email !== "" &&
			phone !== "" &&
			userType !== "" &&
			location !== "" &&
			password !== "" &&
			password.length >= 6 &&
			confirmPassword !== "" &&
			password === confirmPassword;

		setIsFormValid(isFormValid);
	}, [
		name,
		username,
		email,
		phone,
		userType,
		location,
		password,
		confirmPassword,
	]);

	const handleContinue = (e) => {
		e.preventDefault();

		// Show the loading modal
		handleOpenModal();

		// Simulate an asynchronous operation
		setLoading(true);
		setTimeout(() => {
			// Hide the loading modal
			setLoading(false);
			handleCloseModal();

			// Create an object to store the form data
			const formData = {
				name,
				username,
				email,
				phone,
				userType,
				location,
				password,
			};

			// Save the form data object to localStorage
			localStorage.setItem("formData", JSON.stringify(formData));

			// Continue to the next step
			onNextStep();
		}, 2000);
	};

	const handleError = () => {
		setError("Error occurred");
		setTimeout(() => {
			setError("");
		}, 2000);
	};

	const handleSuccess = () => {
		setSuccess("Success");
		setTimeout(() => {
			setSuccess("");
		}, 2000);
	};

	const handleCredentialResponse = (response) => {
		if (response.credential) {
			const userData = jwtDecode(response.credential);
			console.log(userData);
			const email = userData.email;
			setEmail(email);
			const name = userData.name;
			setName(name);
			const username = userData.family_name;
			setUsername(username);
		}

		if (response.status === "ERROR") {
			handleError();
		}

		if (response.status === "SUCCESS") {
			handleSuccess();
		}
	};

	useEffect(() => {
		// global google
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.onload = () => {
			google.accounts.id.initialize({
				client_id:
					"776023976375-lt8on08bndq3os2l46o7rt2g44ukoi3v.apps.googleusercontent.com",
				callback: handleCredentialResponse,
			});

			google.accounts.id.renderButton(document.getElementById("googleButton"), {
				theme: "outline dark #2f3542 2px solid",
				size: "large",
				text: "continue_with",
				prompt_parent_id: "googleButton",
				prompt: "select_account consent",
			});
		};

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<div className="RegisterLeftCont">
			<p>Please enter your details here</p>
			<form>
				<div className="RegisterInput">
					<TextField
						label="Name"
						variant="outlined"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						color="success"
						size="small"
						fullWidth
					/>
					<TextField
						label="Username"
						variant="outlined"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						size="small"
						fullWidth
						color="success"
					/>
				</div>
				<div className="RegisterInput">
					<TextField
						label="Email"
						variant="outlined"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						size="small"
						fullWidth
						color="success"
					/>
				</div>
				<div className="RegisterInput">
					<TextField
						label="Phone"
						variant="outlined"
						type="phone"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
						size="small"
						fullWidth
						color="success"
					/>
					<TextField
						label="User Type"
						variant="outlined"
						type="text"
						value={userType}
						onChange={(e) => setUserType(e.target.value)}
						required
						select
						fullWidth
						size="small"
						color="success"
					>
						<MenuItem value="farmer">Farmer</MenuItem>
						<MenuItem value="agribusiness">Agribusiness</MenuItem>
						<MenuItem value="agriprofessional">Agriprofessional</MenuItem>
					</TextField>
				</div>
				<div className="RegisterInput">
					<TextField
						label="Location"
						variant="outlined"
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
						size="small"
						fullWidth
						color="success"
					/>
				</div>
				<div className="RegisterInput">
					<TextField
						label="Password"
						variant="outlined"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						helperText="Password must be at least 6 characters long"
						size="small"
						fullWidth
						color="success"
					/>
					<TextField
						label="Confirm Password"
						variant="outlined"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						helperText="Passwords must match"
						size="small"
						fullWidth
						color="success"
					/>
				</div>

				{!loading && (
					<>
						<button
							className="RegisterBtn"
							type="submit"
							onClick={handleContinue}
							disabled={!isFormValid}
							style={{
								width: "44%",
							}}
						>
							Continue <i className="fas fa-arrow-right"></i>
						</button>
						<button
							id="googleButton"
							type="button"
							style={{
								width: "47.5%",
								backgroundColor: "#fff",
								color: "#2f3542",
								borderRadius: 5,
							}}
						>
							<i className="fab fa-google"></i>
							Continue with Google
						</button>
					</>
				)}

				{/* Loading modal */}
				{loading && (
					<Modal
						open={showModal}
						onCancel={handleError} // Allow user to cancel in case of error
						footer={null}
						closeIcon={null}
						closable={false}
						wrapClassName="LoadingModal"
					>
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
						<p>
							<strong>Creating your account...</strong>
						</p>
						<p>Please wait...</p>
					</Modal>
				)}

				{/* Error modal */}
				{error && (
					<Modal
						title="Error"
						open={error}
						onCancel={handleError}
						onOk={handleError}
					>
						<p>{error}</p>
					</Modal>
				)}

				{/* Success modal */}
				{success && (
					<Modal
						title="Success"
						open={success}
						onCancel={handleSuccess}
						onOk={handleSuccess}
					>
						<p>{success}</p>
					</Modal>
				)}
			</form>
		</div>
	);
};

export default Step0;
