import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-use-history";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isRemember, setIsRemember] = useState(false);
	const [isEyeOpen, setIsEyeOpen] = useState(false);
	const history = useHistory();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

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

	useEffect(() => {
		localStorage.setItem(
			"agrisolveData",
			JSON.stringify({ email, isRemember })
		);
	}, [email, isRemember]);

	const handleLogin = async (e) => {
		e.preventDefault();

		// Validate the form
		if (!email || !password) {
			setError("Please fill in all the fields");
			return;
		}

		// Set loading to true
		setLoading(true);

		// Make an HTTP request to login the user
		try {
			const response = await fetch(
				"https://agrisolve-techsupport254.vercel.app/auth/login",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				}
			);

			if (response.ok) {
				// User logged in successfully
				setSuccess("Logged in successfully");

				// Save the user data in local storage (email, username, token, verificationStatus)
				const data = await response.json();
				localStorage.setItem("user", JSON.stringify(data));
				console.log(data);

				// Update login status in the database
				const user = JSON.parse(localStorage.getItem("user"));
				console.log(email);
				await fetch(
					`https://agrisolve-techsupport254.vercel.app/auth/user/${email}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ loginStatus: "loggedIn" }),
					}
				);

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

	const togglePasswordVisibility = () => {
		setIsEyeOpen(!isEyeOpen);
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
					<div className="LoginLeftCont">
						<h3>Welcome Back!</h3>
					</div>
				</div>
				<div className="LoginRight">
					<div className="LoginCont">
						<h3>Login To Agrisolve</h3>
						<p>Please enter your details here</p>
						<form onSubmit={handleLogin}>
							<div className="input-container LoginInput">
								<input
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<i className="fas fa-envelope"></i>
							</div>
							<div className="input-container LoginInput">
								<input
									type={isEyeOpen ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<i className="fas fa-lock"></i>
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
							</div>

							{/* remember me */}
							<div className="LoginRemember">
								<input
									type="checkbox"
									id="remember"
									name="remember"
									checked={isRemember}
									onChange={(e) => setIsRemember(e.target.checked)}
								/>
								<label htmlFor="remember">Remember me</label>
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

							{/* forgot password */}
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
							<button className="LoginBtn2Google">
								<i className="fab fa-google"></i>
								Login with Google
							</button>
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
		</div>
	);
};

export default Login;
