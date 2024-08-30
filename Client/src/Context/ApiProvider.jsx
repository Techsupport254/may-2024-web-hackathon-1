import { createContext, useState, useEffect } from "react";
import axios from "axios";

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
	const [userData, setUserData] = useState(null);
	const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState("");
	const [paymentData, setPaymentData] = useState(null);
	const [isPaymentDataLoaded, setIsPaymentDataLoaded] = useState(false);
	const [shippingData, setShippingData] = useState(null);
	const [isShippingDataLoaded, setIsShippingDataLoaded] = useState(false);
	const [products, setProducts] = useState([]);
	const [events, setEvents] = useState([]);
	const [pendingOrders, setPendingOrders] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [orderData, setOrderData] = useState([]);
	const [consults, setConsults] = useState([]);
	const [chats, setChats] = useState([]);
	const [settingsData, setSettingsData] = useState({});

	useEffect(() => {
		const fetchUserData = async () => {
			const user = JSON.parse(localStorage.getItem("agrisolveData"));
			if (user) {
				setUserData(user);
				setToken(user.token);

				try {
					const response = await axios.get(
						`http://localhost:8000/auth/users/${user.email}`,
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
					console.error("Error fetching user data:", err);
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
		const fetchEvents = async () => {
			try {
				const response = await axios.get("http://localhost:8000/news");
				const filteredEvents = response.data.filter(
					(event) => event.event === "true"
				);
				setEvents(filteredEvents);
			} catch (err) {
				console.error("Error fetching events:", err);
			}
		};

		fetchEvents();
	}, []);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get("http://localhost:8000/products");
				const filteredProducts = response.data.filter(
					(product) => product.productStatus !== "Draft"
				);
				setProducts(filteredProducts);
			} catch (err) {
				console.error("Error fetching products:", err);
			}
		};

		fetchProducts();
	}, []);

	const fetchOrderItems = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/order/user/${userId}`
			);
			if (response.data) {
				setOrderData(response.data);
			}
		} catch (error) {
			console.error("Error fetching order items:", error);
		}
	};

	useEffect(() => {
		if (userData?.id) {
			fetchCartItems(userData.id);
			fetchOrders(userData.id);
			fetchOrderItems(userData.id);
		}
	}, [userData]);

	const handleLogout = async () => {
		try {
			if (userData) {
				await axios.patch(
					`http://localhost:8000/auth/users/${userData.email}`,
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

				window.location.replace("/");
			}
		} catch (err) {
			console.error("Error logging out:", err);
		}
	};

	const handleLogin = (data) => {
		localStorage.setItem("agrisolveData", JSON.stringify(data));
		setUserData(data);
		setToken(data.token);
		setIsLoggedIn(true);
	};

	const fetchCartItems = async (userId) => {
		try {
			const response = await axios.get(`http://localhost:8000/cart/${userId}`);
			if (response.data) {
				setCartItems(response.data.products);
			}
		} catch (error) {
			console.error("Error fetching cart items:", error);
		}
	};

	const fetchOrders = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/order/user/${userId}`
			);
			setPendingOrders(response.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	const fetchConsults = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/consult/user/${userId}`
			);
			setConsults(response.data);
		} catch (error) {
			console.error("Error fetching consults:", error);
		}
	};

	const fetchChats = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/chats/chats`);
			setChats(response.data);
		} catch (error) {
			console.error("Error fetching chats:", error);
		}
	};

	const fetchSettings = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/settings/${userId}`
			);
			setSettingsData(response.data);
		} catch (error) {
			console.error("Error fetching settings:", error);
		}
	};

	useEffect(() => {
		if (userData?.id) {
			fetchConsults(userData.id);
			fetchChats();
			fetchSettings(userData.id);
		}
	}, [userData]);

	return (
		<ApiContext.Provider
			value={{
				userData,
				isUserDataLoaded,
				isLoggedIn,
				token,
				paymentData,
				isPaymentDataLoaded,
				shippingData,
				isShippingDataLoaded,
				products,
				events,
				pendingOrders,
				cartItems,
				orderData,
				handleLogin,
				handleLogout,
				fetchCartItems,
				fetchOrders,
				fetchOrderItems,
				consults,
				fetchConsults,
				settingsData,
			}}
		>
			{children}
		</ApiContext.Provider>
	);
};

export { ApiProvider, ApiContext };
