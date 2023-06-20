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
	const [userData, setUserData] = useState(null);
	const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
	const [isLoggedin, setIsLoggedin] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			const user = JSON.parse(localStorage.getItem("agrisolveData"));
			if (user) {
				setUserData(user);

				try {
					const response = await axios.get(
						`http://localhost:4000/auth/user/${user.email}`,
						{
							headers: {
								"x-auth-token": user.token,
							},
						}
					);

					setUserData(response.data);

					if (response.data.loginStatus === "loggedIn") {
						setIsLoggedin(true);
					}
				} catch (err) {
					console.log(err);
				}
			}

			setIsUserDataLoaded(true);
		};

		fetchUserData();
	}, []);

	const handleLogout = async () => {
		setIsLoggedin(false);
		setUserData(null);

		try {
			if (userData) {
				await axios.patch(
					`http://localhost:4000/auth/user/${userData.email}`,
					{ isRemember: false, loginStatus: "loggedOut" },
					{
						headers: {
							"x-auth-token": userData.token,
						},
					}
				);

				localStorage.removeItem("agrisolveData");
			}
		} catch (err) {
			console.log(err);
		}

		navigate("/login");
	};

	const handleLogin = async () => {
		navigate("/");
	};

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
				<i className="fas fa-spinner fa-spin"></i>
			</div>
		);
	}

	const shouldRenderNavbarFooter = !(
		location.pathname === "/login" ||
		location.pathname === "/register" ||
		location.pathname === "/forgot"
	);

	return (
		<div className="App">
			{shouldRenderNavbarFooter && (
				<Navbar onLogout={handleLogout} userData={userData} />
			)}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/categories" element={<Categories />} />
				{userData ? (
					<>
						<Route path="/consult" element={<Consult userData={userData} />} />
						<Route path="/cart" element={<Cart userData={userData} />} />
						<Route
							path="/profile"
							element={
								<Profile userData={userData} handleLogout={handleLogout} />
							}
						/>
						<Route path="/orders" element={<Orders userData={userData} />} />
						<Route path="/login" element={<Navigate to="/" replace />} />
					</>
				) : (
					<>
						<Route path="/consult" element={<Navigate to="/login" replace />} />
						<Route path="/cart" element={<Navigate to="/login" replace />} />
						<Route path="/profile" element={<Navigate to="/login" replace />} />
						<Route path="/orders" element={<Navigate to="/login" replace />} />
						<Route path="/login" element={<Login onLogin={handleLogin} />} />
					</>
				)}
				{!userData && <Route path="/register" element={<Register />} />}
				{!userData && <Route path="/forgot" element={<Forgot />} />}
			</Routes>
			{shouldRenderNavbarFooter && <Footer />}
		</div>
	);
};

export default App;
