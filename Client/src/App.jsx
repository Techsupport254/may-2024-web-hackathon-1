import { useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
import ProductModal from "./Pages/ProductModal/ProductModal";
import Events from "./Pages/Events/Events";
import NotFound from "./Pages/404/NotFound";
import PaymentCallback from "./Pages/PaymentCallback/PaymentCallback";
import { ApiContext } from "./Context/ApiProvider";

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
		!(
			location.pathname === "/login" ||
			location.pathname === "/register" ||
			location.pathname === "/forgot"
		) && isUserDataLoaded;

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
	return (
		<div className="App">
			{shouldRenderNavbarFooter && <Navbar />}
			<Routes>
				<Route path="/" element={<Home products={products} />} />
				<Route
					path="/product/:id"
					element={<ProductModal products={products} cartItems={cartItems} />}
				/>
				<Route path="/products" element={<Categories products={products} />} />
				<Route path="/events" element={<Events events={events} />} />
				<Route path="/event/:id" element={<Events events={events} />} />
				<Route path="*" element={<NotFound />} />
				<Route path="payment" element={<PaymentCallback />} />
				{userData ? (
					<>
						<Route path="/consult" element={<Consult />} />
						<Route
							path="/cart"
							element={<Cart cartItemsData={cartItems} products={products} />}
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
						<Route path="/login" element={<Navigate to="/" replace />} />
					</>
				) : (
					<>
						<Route path="/account" element={<Navigate to="/login" replace />} />
						<Route path="/consult" element={<Navigate to="/login" replace />} />
						<Route path="/cart" element={<Navigate to="/login" replace />} />
						<Route path="/profile" element={<Navigate to="/login" replace />} />
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
