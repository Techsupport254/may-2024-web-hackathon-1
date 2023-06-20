import { Modal, Spin } from "antd";
import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

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
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Enter your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="RegisterInput">
					<label htmlFor="name">Username</label>
					<input
						type="text"
						placeholder="Enter your username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="RegisterInput">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="RegisterInput">
					<label htmlFor="phone">Phone</label>
					<input
						type="text"
						placeholder="Enter your phone number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/>
				</div>
				<div className="RegisterInput">
					<label htmlFor="userType">User Type</label>
					<select
						name="userType"
						id="userType"
						value={userType}
						onChange={(e) => setUserType(e.target.value)}
						required
					>
						<option value="">Select user type</option>
						<option value="farmer">Farmer</option>
						<option value="agribusiness">Agribusiness</option>
						<option value="agriprofessional">Agriprofessional</option>
					</select>
				</div>
				<div className="RegisterInput">
					<label htmlFor="location">Location</label>
					<input
						type="text"
						placeholder="Enter your location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>
				</div>
				<div className="RegisterInput">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="RegisterInput">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						placeholder="Confirm your password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
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
								width: "45%",
								backgroundColor: "#fff",
								color: "#2f3542",
								border: "2px solid #2f3542",
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
						visible={error}
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
