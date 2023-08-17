import React, { useEffect, useState } from "react";
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./Components/Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Categories from "./Components/Pages/Categories/Categories";
import Consult from "./Components/Pages/Consult/Consult";
import Cart from "./Components/Pages/Cart/Cart";
import Profile from "./Components/Profile/Profile";
import Orders from "./Components/Orders/Orders";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Forgot from "./Components/Forgot/Forgot";
import axios from "axios";

const App = () => {
	const [paymentData, setPaymentData] = useState(null);
	const [isPaymentDataLoaded, setIsPaymentDataLoaded] = useState(false);
	const [shippingData, setShippingData] = useState(null);
	const [isShippingDataLoaded, setIsShippingDataLoaded] = useState(false);
	const [userData, setUserData] = useState(null);
	const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState("");
	const location = useLocation();
	const navigate = useNavigate();
	const inactivityLogoutTimeout = 10 * 60 * 1000; // 10 minutes
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const fetchUserData = async () => {
			const user = JSON.parse(localStorage.getItem("agrisolveData"));
			if (user) {
				setUserData(user);
				setToken(user.token);

				try {
					const response = await axios.get(
						`https://agrisolve-techsupport254.vercel.app/auth/user/${user.email}`,
						{
							headers: {
								"x-auth-token": user.token,
							},
						}
					);

					setUserData(response.data);

					if (response.data.loginStatus === "loggedIn") {
						setIsLoggedIn(true);
					}
				} catch (err) {
					console.log(err);
				}
			}

			setIsUserDataLoaded(true);
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		const fetchPaymentData = async () => {
			const paymentData = JSON.parse(localStorage.getItem("selectedAccount"));
			if (paymentData) {
				setPaymentData(paymentData);
			}

			setIsPaymentDataLoaded(true);
		};

		fetchPaymentData();
	}, []);

	useEffect(() => {
		const fetchShippingData = async () => {
			const shippingData = JSON.parse(localStorage.getItem("selectedLocation"));
			if (shippingData) {
				setShippingData(shippingData);
			}

			setIsShippingDataLoaded(true);
		};

		fetchShippingData();
	}, []);

	useEffect(() => {
		let inactivityTimer;

		const handleUserActivity = () => {
			clearTimeout(inactivityTimer);
			inactivityTimer = setTimeout(() => {
				handleLogout();
			}, inactivityLogoutTimeout);
		};

		if (userData && userData.loginStatus === "loggedIn") {
			document.addEventListener("mousemove", handleUserActivity);
			document.addEventListener("keydown", handleUserActivity);
			setIsLoggedIn(true);
		}

		return () => {
			clearTimeout(inactivityTimer);
			document.removeEventListener("mousemove", handleUserActivity);
			document.removeEventListener("keydown", handleUserActivity);
		};
	}, [userData]);

	const handleLogout = async () => {
		try {
			if (userData) {
				await axios.patch(
					`https://agrisolve-techsupport254.vercel.app/auth/user/${userData.email}`,
					{
						isRemember: false,
						loginStatus: "loggedOut",
						token: "",
						lastLogin: new Date(),
					},
					{
						headers: {
							"x-auth-token": userData.token,
						},
					}
				);

				setUserData(null);
				setIsLoggedIn(false);

				localStorage.removeItem("agrisolveData");

				// Redirect to home page after logout
				window.location.replace("/");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogin = async (data) => {
		// Save the user data in local storage (email, username, token, verificationStatus)
		localStorage.setItem("agrisolveData", JSON.stringify(data));
		setUserData(data);
		setToken(data.token);
		setIsLoggedIn(true);
		navigate("/");
	};

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://agrisolve-techsupport254.vercel.app/products"
				);
				setProducts(response.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchProducts();
	}, []);

	if (!isUserDataLoaded) {
		return (
			<div
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
			>
				<i
					className="fas fa-spinner fa-spin"
					style={{
						fontSize: "50px",
						color: "green",
					}}
				></i>
			</div>
		);
	}

	const shouldRenderNavbarFooter =
		!(
			location.pathname === "/login" ||
			location.pathname === "/register" ||
			location.pathname === "/forgot"
		) && isUserDataLoaded;

	return (
		<div className="App">
			{shouldRenderNavbarFooter && (
				<Navbar
					isLoggedIn={isLoggedIn}
					userData={userData}
					handleLogout={handleLogout}
				/>
			)}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/products" element={<Categories products={products} />} />
				{isLoggedIn ? (
					<>
						<Route path="/consult" element={<Consult userData={userData} />} />
						<Route path="/cart" element={<Cart userData={userData} />} />
						<Route
							path="/profile"
							element={
								<Profile
									userData={userData}
									handleLogout={handleLogout}
									shippingData={shippingData}
									paymentData={paymentData}
								/>
							}
						/>
						<Route path="/orders" element={<Orders userData={userData} />} />
						<Route path="/login" element={<Navigate to="/" replace />} />
					</>
				) : (
					<>
						<Route path="/consult" element={<Navigate to="/login" replace />} />
						<Route path="/cart" element={<Navigate to="/login" replace />} />
						<Route
							path="/profile"
							element={
								<Navigate
									to="/login"
									replace
									userData={userData}
									handleLogout={handleLogout}
									paymentData={paymentData}
									shippingData={shippingData}
								/>
							}
						/>
						<Route path="/orders" element={<Navigate to="/login" replace />} />
						<Route path="/login" element={<Login onLogin={handleLogin} />} />
					</>
				)}
				<Route path="/register" element={<Register />} />
				{!isLoggedIn && <Route path="/forgot" element={<Forgot />} />}
			</Routes>
			{shouldRenderNavbarFooter && <Footer />}
		</div>
	);
};

export default App;
