import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-use-history";

const Step3 = () => {
	const history = useHistory();
	const [user, setUser] = useState(null);
	const [verificationStatus, setVerificationStatus] = useState(null);
	const [verificationCode, setVerificationCode] = useState("");
	const [isCodeVerified, setIsCodeVerified] = useState(false);

	useEffect(() => {
		// Fetch user email from local storage
		const storedData = localStorage.getItem("formData");
		const parsedData = storedData ? JSON.parse(storedData) : {};
		const email = parsedData.email;

		const fetchUserData = async () => {
			try {
				// Make an HTTP request to fetch user data from the database
				const response = await axios.get(
					`http://localhost:4000/auth/user/${email}`
				);

				// Update the user state with the fetched data
				setUser(response.data);
				console.log(response.data);
				const verificationStatus = response.data.verificationStatus;
				setVerificationStatus(verificationStatus);
			} catch (error) {
				console.log(error);
				// Handle error and redirect to an error page or display an error message
				history.push("/error");
			}
		};

		if (email) {
			fetchUserData();
		}
	}, [history]);

	const handleVerification = () => {
		// Perform verification logic here
		if (verificationCode === user.verificationCode) {
			setIsCodeVerified(true);
			// Update the verification status in the database
			axios
				.patch(`http://localhost:4000/auth/user/${user.email}`, {
					verificationStatus: "verified",
				})
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			setIsCodeVerified(false);

			// Reset the verification code
			setVerificationCode("");

			// Display an error message
			alert("Invalid verification code");

			// Focus on the verification code input field
			document.getElementById("VerificationCode").focus();

			return;
		}
	};

	// handle resend verification code
	const handleResendVerificationCode = () => {
		// Perform resend verification code logic here
		// Generate a new verification code
		const newVerificationCode = Math.floor(100000 + Math.random() * 900000);

		// Update the verification code in the database
		axios
			.patch(`http://localhost:4000/auth/user/${user.email}`, {
				verificationCode: newVerificationCode,
			})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});

		// Update the verification code in the user state
		setUser({ ...user, verificationCode: newVerificationCode });

		// Display a success message
		alert("Verification code sent successfully");

		// Focus on the verification code input field
		document.getElementById("VerificationCode").focus();
	};

	// handle login
	const handleLogin = () => {
		if (isCodeVerified) {
			// Redirect to login page
			history.push("/login");
		}
	};

	if (!user) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					height: "30vh",
					gap: "1rem",
				}}
				className="RegisterLeftCont"
			>
				<i className="fas fa-spinner fa-spin"></i>
			</div>
		);
	}

	return (
		<div className="RegisterLeftCont">
			<div className="Successful">
				<span>
					<i className="fas fa-check-circle"></i>
				</span>
				<h3>Registration Successful</h3>
				<p>
					You have successfully registered. Please check your email <br /> (
					{user.email}) to confirm your account.
				</p>
				<span>OR</span>
				<p>Enter the verification code here to login.</p>
				<div className="RegisterInput">
					<label htmlFor="VerificationCode">Verification Code</label>
					<input
						type="text"
						id="VerificationCode"
						placeholder="Enter the verification Code"
						value={verificationCode}
						onChange={(e) => setVerificationCode(e.target.value)}
					/>
				</div>
				<button
					className="Verify"
					style={{
						backgroundColor: "transparent",
						cursor: "pointer",
						border: "none",
					}}
					onClick={handleVerification}
				>
					<i
						className="fas fa-check-circle"
						style={{
							color: "green",
							fontSize: "1.5rem",
						}}
					></i>
					<p>
						<strong>
							{isCodeVerified ? "Code Verified" : verificationStatus}
						</strong>
					</p>
				</button>
				<div
					className="BottomBtn"
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						width: "100%",
					}}
				>
					<button
						className="RegisterBtn"
						onClick={handleLogin}
						style={{
							backgroundColor: "white",
							cursor: "pointer",
							border: "none",
							color: "green",
						}}
					>
						Login
					</button>
					{user.userType !== "farmer" && (
						<button
							className="RegisterBtn"
							style={{
								backgroundColor: "white",
								cursor: "pointer",
								border: "none",
								color: "green",
							}}
						>
							Login to admin Panel
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Step3;
