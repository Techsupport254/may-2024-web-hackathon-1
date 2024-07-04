import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
	InputAdornment,
	Switch,
	TextField,
	Snackbar,
	Alert,
	styled,
} from "@mui/material";
import "./Login.css";
import Logo from "../../assets/logo.png";
import { ApiContext } from "../../Context/ApiProvider";

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
	const [password, setPassword] = useState("");
	const [isRemember, setIsRemember] = useState(false);
	const [isEyeOpen, setIsEyeOpen] = useState(false);
	const [notification, setNotification] = useState({
		open: false,
		severity: "success",
		message: "",
	});
	const [loading, setLoading] = useState(false);

	const { handleLogin } = useContext(ApiContext);

	useEffect(() => {
		const agrisolveData = JSON.parse(localStorage.getItem("agrisolveData"));
		if (agrisolveData) {
			setEmail(agrisolveData.email);
			setIsRemember(agrisolveData.isRemember);
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			setNotification({
				open: true,
				severity: "error",
				message: "Please fill in all the fields",
			});
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("http://localhost:8000/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message);
			}

			const data = await response.json();

			setNotification({
				open: true,
				severity: "success",
				message: data.message,
			});

			// Save user data and token to local storage
			localStorage.setItem(
				"agrisolveData",
				JSON.stringify({
					...data,
					isRemember,
				})
			);

			handleLogin(data);

			document.cookie = isRemember
				? `rememberMe=true; expires=${getCookieExpiration()}; path=/`
				: "rememberMe=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

			setTimeout(() => {
				setLoading(false);
				window.location.href = "/";
			}, 3000);
		} catch (error) {
			console.error("Error logging in:", error);
			setNotification({
				open: true,
				severity: "error",
				message: error.message,
			});
			setLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setIsEyeOpen(!isEyeOpen);
	};

	const getCookieExpiration = () => {
		const days = isRemember ? 7 : 0;
		const date = new Date();
		date.setDate(date.getDate() + days);
		return date.toUTCString();
	};

	const handleCloseNotification = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setNotification({
			...notification,
			open: false,
		});
	};

	return (
		<div className="Login">
			<div className="LoginContainer">
				<div className="LoginLeft">
					<h3>Welcome Back!</h3>
					<div className="LoginLogo">
						<img src={Logo} alt="Agrisolve" />
					</div>
				</div>
				<div className="LoginRight">
					<div className="LoginCont">
						<img src={Logo} alt="logo" />
						<h3>Login To Agrisolve</h3>
						<p>Please enter your details here</p>
						<form onSubmit={handleSubmit}>
							<div className="LoginInput">
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
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "var(--success-dark)",
											},
											"&:hover fieldset": {
												borderColor: "var(--success-dark)",
											},
											"&.Mui-focused fieldset": {
												borderColor: "var(--success-dark)",
											},
											"&.Mui-focused": {
												color: "var(--success-dark)",
											},
										},
									}}
								/>
							</div>
							<div className="LoginInput">
								<TextField
									type={isEyeOpen ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									fullWidth
									variant="outlined"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<i className="fas fa-lock"></i>
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<span
													className="eye-visibility"
													onClick={togglePasswordVisibility}
												>
													{isEyeOpen ? (
														<i className="fas fa-eye"></i>
													) : (
														<i className="fas fa-eye-slash"></i>
													)}
												</span>
											</InputAdornment>
										),
									}}
									sx={{
										"& .MuiOutlinedInput-root": {
											"& fieldset": {
												borderColor: "var(--success-dark)",
											},
											"&:hover fieldset": {
												borderColor: "var(--success-dark)",
											},
											"&.Mui-focused fieldset": {
												borderColor: "var(--success-dark)",
											},
											"&.Mui-focused": {
												color: "var(--success-dark)",
											},
										},
									}}
								/>
							</div>
							<div className="LoginRemember">
								<IOSSwitch
									checked={isRemember}
									onChange={(e) => setIsRemember(e.target.checked)}
									color="primary"
									name="remember"
									inputProps={{ "aria-label": "remember checkbox" }}
								/>
								<label htmlFor="remember">Remember me</label>
							</div>

							<div className="LoginBtns">
								<button type="submit" className="LoginBtn1">
									{loading ? (
										<div className="spinner-border text-light" role="status">
											<span className="visually-hidden">
												<i className="fas fa-spinner fa-spin"></i> Loading...
											</span>
										</div>
									) : (
										"Login"
									)}
								</button>
								<button
									className="LoginBtn2"
									onClick={() => alert("Admin panel is underway")}
									type="button"
								>
									<i className="fas fa-user"></i>
									Login to admin
								</button>
							</div>
							<div className="LoginForgot">
								<p>
									<Link to="/forgot">Forgot Password?</Link>
								</p>
							</div>
						</form>
						<p>
							Don't have an account?{" "}
							<span>
								<Link to="/register">Register</Link>
							</span>
						</p>
					</div>
				</div>
			</div>
			<Snackbar
				open={notification.open}
				autoHideDuration={6000}
				onClose={handleCloseNotification}
			>
				<Alert
					onClose={handleCloseNotification}
					severity={notification.severity}
					sx={{ width: "100%" }}
				>
					{notification.message}
				</Alert>
			</Snackbar>
		</div>
	);
};

export default Login;
