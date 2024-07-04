import React, { useState, useEffect, useContext } from "react";
import "./Forgot.css";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { InputAdornment, Switch, TextField } from "@mui/material";
import { ApiContext } from "../../Context/ApiProvider";
import { Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";

// Define the IOS switch component
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

const Login = () => {
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [isRemember, setIsRemember] = useState(false);
	const [isEyeOpen, setIsEyeOpen] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const { handleLogin } = useContext(ApiContext);

	useEffect(() => {
		let errorTimeout;

		if (error) {
			errorTimeout = setTimeout(() => {
				setError("");
			}, 3000);
		}

		return () => clearTimeout(errorTimeout);
	}, [error]);

	useEffect(() => {
		const agrisolveData = JSON.parse(localStorage.getItem("agrisolveData"));
		if (agrisolveData) {
			setEmail(agrisolveData.email);
			setIsRemember(agrisolveData.isRemember);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate the form
		if (!email || !phone) {
			setError("Please fill in all the fields");
			return;
		}

		// Set loading to true
		setLoading(true);

		try {
			const response = await fetch("http://localhost:8000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, phone }),
			});

			if (response.ok) {
				const data = await response.json();

				// User logged in successfully
				setSuccess(data.message);

				// Call context login handler
				handleLogin(data);

				// Set the remember me cookie
				if (isRemember) {
					document.cookie = `rememberMe=true; expires=${getCookieExpiration()}; path=/`;
				} else {
					document.cookie =
						"rememberMe=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
				}

				// Set loading to false after 3 seconds
				setTimeout(() => {
					setLoading(false);
					// Redirect to the home page after 3 seconds
					window.location.href = "/";
				}, 3000);
			} else {
				// Error logging in
				const data = await response.json();
				setError(data.message);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error logging in", error);
			setLoading(false);
		}
	};

	const getCookieExpiration = () => {
		const days = isRemember ? 7 : 0;
		const date = new Date();
		date.setDate(date.getDate() + days);
		return date.toUTCString();
	};

	return (
		<div className="Login">
			<div className="LoginContainer">
				<div className="LoginLeft">
					<h3>Forgot Password?</h3>
					<div className="LoginLogo">
						<img src={Logo} alt="Agrisolve" />
					</div>
				</div>
				<div className="LoginRight">
					<div className="LoginCont">
						<img src={Logo} alt="logo" />
						<h3>Reset your Password</h3>
						<p>Please enter your email and phone number here</p>
						<form onSubmit={handleSubmit}>
							<div className=" LoginInput">
								<TextField
									variant="outlined"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i className="fas fa-envelope"></i>
											</InputAdornment>
										),
									}}
								/>
							</div>
							<div className=" LoginInput">
								<TextField
									type="text"
									placeholder="Enter your phone number"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									fullWidth
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i className="fas fa-phone"></i>
											</InputAdornment>
										),
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "var(--success-dark",
											},
											"&:hover fieldset": {
												borderColor: "var(--success-dark",
											},
											"&.Mui-focused fieldset": {
												borderColor: "var(--success-dark",
											},
											"&.Mui-focused": {
												color: "var(--success-dark",
											},
										},
									}}
								/>
							</div>
							{error && (
								<p className="error" style={{ color: "red", margin: "1rem" }}>
									{error}
								</p>
							)}
							{success && (
								<p
									className="success"
									style={{ color: "green", margin: "1rem" }}
								>
									{success}
								</p>
							)}

							<div className="LoginBtns">
								<button type="submit" className="LoginBtn1">
									{loading ? (
										<div className="spinner-border text-light" role="status">
											<span className="visually-hidden">
												<i className="fas fa-spinner fa-spin"></i> Loading...
											</span>
										</div>
									) : (
										"Get Password"
									)}
								</button>
								{/* back to login */}
								<button
									type="button"
									className="LoginBtn2"
									onClick={() => (window.location.href = "/login")}
								>
									Back to Login
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
