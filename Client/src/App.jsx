import React, { useContext, lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { ApiContext } from "./Context/ApiProvider";

// Lazy load pages
const Home = lazy(() => import("./Pages/Home/Home"));
const Categories = lazy(() => import("./Pages/Categories/Categories"));
const Consult = lazy(() => import("./Pages/Consult/Consult"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Profile = lazy(() => import("./Components/Profile/Profile"));
const Orders = lazy(() => import("./Pages/Orders/Orders"));
const Register = lazy(() => import("./Pages/Register/Register"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Forgot = lazy(() => import("./Pages/Forgot/Forgot"));
const ProductModal = lazy(() => import("./Pages/ProductModal/ProductModal"));
const Events = lazy(() => import("./Pages/Events/Events"));
const NotFound = lazy(() => import("./Pages/404/NotFound"));
const PaymentCallback = lazy(() =>
	import("./Pages/PaymentCallback/PaymentCallback")
);
const Order = lazy(() => import("./Pages/Order/Order"));
const ConsultChat = lazy(() => import("./Components/ConsultChat/ConsultChat"));

const Loading = () => (
	<div className="Loading">
		<div className="loader">
			<div className="inner one"></div>
			<div className="inner two"></div>
			<div className="inner three"></div>
		</div>
		<div className="loader">
			<div className="inner one"></div>
			<div className="inner two"></div>
			<div className="inner three"></div>
		</div>
	</div>
);

const App = () => {
	const {
		userData,
		isUserDataLoaded,
		isLoggedIn,
		paymentData,
		shippingData,
		products,
		events,
		cartItems,
		handleLogout,
		handleLogin,
	} = useContext(ApiContext);

	const location = useLocation();

	const shouldRenderNavbarFooter =
		isUserDataLoaded &&
		!["/login", "/register", "/forgot", "/consult-chats"].includes(
			location.pathname
		);

	return (
		<div className="App">
			{shouldRenderNavbarFooter && <Navbar />}
			<Suspense fallback={<Loading />}>
				{isUserDataLoaded ? (
					<Routes>
						<Route path="/" element={<Home products={products} />} />
						<Route
							path="/product/:id"
							element={
								<ProductModal products={products} cartItems={cartItems} />
							}
						/>
						<Route
							path="/products"
							element={<Categories products={products} />}
						/>
						<Route path="/events" element={<Events events={events} />} />
						<Route path="/event/:id" element={<Events events={events} />} />
						<Route path="*" element={<NotFound />} />
						<Route path="payment" element={<PaymentCallback />} />
						{userData ? (
							<>
								<Route path="/consult" element={<Consult />} />
								<Route
									path="/cart"
									element={
										<Cart cartItemsData={cartItems} products={products} />
									}
								/>
								<Route
									path="/profile"
									element={
										<Profile
											handleLogout={handleLogout}
											shippingData={shippingData}
											paymentData={paymentData}
										/>
									}
								/>
								<Route path="/orders" element={<Orders />} />
								<Route path="/order/:id" element={<Order />} />
								<Route path="/consult-chats" element={<ConsultChat />} />
								<Route path="/login" element={<Login />} />
							</>
						) : (
							<>
								<Route
									path="/account"
									element={<Navigate to="/login" replace />}
								/>
								<Route
									path="/consult"
									element={<Navigate to="/login" replace />}
								/>
								<Route
									path="/cart"
									element={<Navigate to="/login" replace />}
								/>
								<Route
									path="/profile"
									element={<Navigate to="/login" replace />}
								/>
								<Route
									path="/orders"
									element={<Navigate to="/login" replace />}
								/>
								<Route
									path="/login"
									element={<Login onLogin={handleLogin} />}
								/>
							</>
						)}
						<Route path="/register" element={<Register />} />
						{!isLoggedIn && <Route path="/forgot" element={<Forgot />} />}
					</Routes>
				) : (
					<Loading />
				)}
			</Suspense>
			{shouldRenderNavbarFooter && <Footer />}
		</div>
	);
};

export default App;
