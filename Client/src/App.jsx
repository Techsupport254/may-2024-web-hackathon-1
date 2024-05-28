import { useEffect, useState } from "react";
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Categories from "./Pages/Categories/Categories";
import Consult from "./Pages/Consult/Consult";
import Cart from "./Pages/Cart/Cart";
import Profile from "./Components/Profile/Profile";
import Orders from "./Components/Orders/Orders";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Forgot from "./Pages/Forgot/Forgot";
import axios from "axios";
import ProductModal from "./Pages/ProductModal/ProductModal";
import Events from "./Pages/Events/Events";
import NotFound from "./Pages/404/NotFound";
import PropTypes from "prop-types";
import PaymentCallback from "./Pages/PaymentCallback/PaymentCallback";

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
	const [events, setEvents] = useState([]);
	const [pendingOrders, setPendingOrders] = useState([]);
	const [cartItems, setCartItems] = useState([]);

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

	// fetch events
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get("https://agrisolve.vercel.app/news");
				// check where event is true
				const filteredEvents = response.data.filter(
					(event) => event.event === "true"
				);
				setEvents(filteredEvents);
			} catch (err) {
				console.log(err);
			}
		};

		fetchEvents();
	}, []);

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
				const filteredProducts = response.data.filter(
					(product) => product.productStatus !== "Draft"
				);
				setProducts(filteredProducts);
			} catch (err) {
				console.log(err);
			}
		};

		fetchProducts();
	}, []);

	// Function to fetch cart items
	const fetchCartItems = async (userId) => {
		try {
			// Send a GET request to the backend API endpoint
			const response = await axios.get(`http://localhost:8000/cart/${userId}`);
			console.log(response.data);
			// Ensure that response.data is not undefined
			if (response.data) {
				// Extract the cart items from the response data
				const cartItems = response.data.products;
				// Ensure that cartItems is not undefined
				if (cartItems) {
					// Log the cart items data
					console.log(cartItems);
					// Set the cart items into the state
					setCartItems(cartItems);
				} else {
					console.error("Cart items data is undefined");
				}
			} else {
				console.error("Response data is undefined");
			}
		} catch (error) {
			// Handle any errors
			console.error("Error fetching cart items:", error);
		}
	};

	// Fetch orders
	const fetchOrders = async (userId) => {
		try {
			// Send a GET request to the backend API endpoint
			const response = await axios.get(`http://localhost:8000/order/${userId}`);
			// Assuming response.data is an array of orders
			setPendingOrders(response.data);
		} catch (error) {
			// Handle any errors
			console.error("Error fetching orders:", error);
		}
	};

	useEffect(() => {
		// Fetch cart items and orders when userData is available
		if (userData?._id) {
			fetchCartItems(userData._id);
			fetchOrders(userData._id);
		}
	}, [userData]);

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
					handleLogin={handleLogin}
					token={token}
					shippingData={shippingData}
					setShippingData={setShippingData}
					paymentData={paymentData}
					setPaymentData={setPaymentData}
					cartItems={cartItems}
					pendingOrders={pendingOrders}
				/>
			)}
			<Routes>
				<Route
					path="/"
					element={<Home products={products} userData={userData} />}
				/>
				<Route
					path="/product/:id"
					element={
						<ProductModal
							products={products}
							userData={userData}
							cartItems={cartItems}
						/>
					}
				/>
				<Route
					path="/products"
					element={<Categories products={products} userData={userData} />}
				/>
				<Route
					path="/events"
					element={<Events userData={userData} events={events} />}
				/>
				<Route
					path="/event/:id"
					element={<Events userData={userData} events={events} />}
				/>
				{/* 404 page */}
				<Route path="*" element={<NotFound userData={userData} />} />

				<Route
					path="payment"
					element={<PaymentCallback userData={userData} />}
				/>
				{isLoggedIn ? (
					<>
						<Route path="/consult" element={<Consult userData={userData} />} />
						<Route
							path="/cart"
							element={
								<Cart
									userData={userData}
									cartItemsData={cartItems}
									products={products}
								/>
							}
						/>
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
						<Route path="/account" element={<Navigate to="/login" replace />} />
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

// validate props
App.PropTypes = {
	userData: PropTypes.object,
	isUserDataLoaded: PropTypes.bool,
	setIsUserDataLoaded: PropTypes.func,
	isLoggedIn: PropTypes.bool,
	setIsLoggedIn: PropTypes.func,
	token: PropTypes.string,
	setToken: PropTypes.func,
	shippingData: PropTypes.object,
	setShippingData: PropTypes.func,
	paymentData: PropTypes.object,
	setPaymentData: PropTypes.func,
	cartItems: PropTypes.object,
	setCartItems: PropTypes.func,
	pendingOrders: PropTypes.array,
	setPendingOrders: PropTypes.func,
};

App.defaultProps = {
	userData: null,
	isUserDataLoaded: false,
	setIsUserDataLoaded: () => {},
	isLoggedIn: false,
	setIsLoggedIn: () => {},
	token: "",
	setToken: () => {},
	shippingData: {},
	setShippingData: () => {},
	paymentData: {},
	setPaymentData: () => {},
	cartItems: {},
	setCartItems: () => {},
	pendingOrders: [],
	setPendingOrders: () => {},
};

export { App };
