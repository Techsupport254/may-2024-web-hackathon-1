// Cart.js
import React, { useState, useEffect, useContext } from "react";
import "./Cart.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Info from "../../Components/Info/Info";
import Pay from "../../Components/Pay/Pay";
import Payment from "../../Components/Payment/Payment";
import CartLeft from "../../Components/CartLeft/CartLeft";
import { Skeleton } from "antd";
import { ApiContext } from "../../Context/ApiProvider";
import axios from "axios";

const steps = ["Payment and Delivery Methods", "Fill Information", "Payment"];

const Cart = () => {
	const { userData } = useContext(ApiContext);
	const [cartItems, setCartItems] = useState([]);
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [deliveryMethod, setDeliveryMethod] = useState(null);
	const [deliveryFee, setDeliveryFee] = useState(0);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [discounts, setDiscounts] = useState([]);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const response = await axios.get(
					`http://localhost:8000/cart/${userData?._id}`
				);
				const itemsWithPrices = await Promise.all(
					response.data.products.map(async (item) => {
						const productResponse = await axios.get(
							`http://localhost:8000/products/${item.productId}`
						);
						return { ...item, price: productResponse.data.price };
					})
				);
				setCartItems(itemsWithPrices);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching cart items:", error);
				setLoading(false);
			}
		};

		if (userData?._id) {
			fetchCartItems();
		}
	}, [userData?._id]);

	useEffect(() => {
		const calculateTotalPrice = () => {
			const total = cartItems.reduce(
				(acc, item) => acc + item.price * item.quantity,
				0
			);
			setTotalPrice(total);
		};
		calculateTotalPrice();
	}, [cartItems]);

	const handleIncreaseQuantity = (productId) => {
		const item = cartItems.find((item) => item.productId === productId);
		if (item) {
			handleQuantityChange(productId, item.quantity + 1);
		}
	};

	const handleDecreaseQuantity = (productId) => {
		const item = cartItems.find((item) => item.productId === productId);
		if (item && item.quantity > 1) {
			handleQuantityChange(productId, item.quantity - 1);
		}
	};

	const handleQuantityChange = async (productId, newQuantity) => {
		if (newQuantity < 1) return; // Prevent setting negative quantities
		try {
			// Send a PATCH request to update the quantity on the server
			const response = await axios.patch(
				`http://localhost:8000/cart/${userData?._id}/${productId}`,
				{ quantity: newQuantity },
				{
					headers: { "Content-Type": "application/json" },
				}
			);

			if (response.status === 200) {
				// Update the quantity locally
				setCartItems((prevCartItems) =>
					prevCartItems.map((item) =>
						item.productId === productId
							? { ...item, quantity: newQuantity }
							: item
					)
				);
			}
		} catch (error) {
			// Rollback the local changes if an error occurs
			setError(
				error.response?.data.message ||
					"An error occurred while updating quantity."
			);
		}
	};

	const handleRemoveItem = async (productId) => {
		try {
			// Optimistically remove the item from the cart locally
			setCartItems((prevCartItems) =>
				prevCartItems.filter((item) => item.productId !== productId)
			);

			// Send a DELETE request to remove the item from the server
			await axios.delete(
				`http://localhost:8000/cart/${userData?._id}/${productId}`,
				{
					headers: { "Content-Type": "application/json" },
				}
			);
		} catch (error) {
			// Rollback the local changes if an error occurs
			setError(
				error.response?.data.message ||
					"An error occurred while removing from cart."
			);
		}
	};

	const totalSteps = () => {
		return steps.length;
	};

	const isLastStep = () => {
		return activeStep === totalSteps() - 1;
	};

	const handleNext = (deliveryMethod) => {
		if (deliveryMethod) {
			setDeliveryMethod(deliveryMethod);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setCompleted({});
	};

	const handleComplete = () => {
		setCompleted((prevCompleted) => ({ ...prevCompleted, [activeStep]: true }));
		handleNext();
	};

	const isCartEmpty = cartItems?.length === 0;
	const formattedPrice = totalPrice
		.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const totalDisplay = `KSh. ${formattedPrice}`;

	// get the total amount of the cart
	const totalAmount = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);
	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return (
					<Info
						handleNext={handleNext}
						handleBack={handleBack}
						isLastStep={isLastStep()}
						totalAmount={totalPrice}
						discounts={discounts}
					/>
				);
			case 1:
				return (
					<Payment
						handleNext={handleNext}
						handleBack={handleBack}
						deliveryMethod={deliveryMethod}
						setDeliveryFee={setDeliveryFee}
						deliveryFee={deliveryFee}
						setSelectedLocation={setSelectedLocation}
						selectedLocation={selectedLocation}
						totalAmount={totalPrice}
						discounts={discounts}
						setDiscounts={setDiscounts}
					/>
				);
			case 2:
				return (
					<Pay
						totalPrice={totalPrice}
						userData={userData}
						deliveryMethod={deliveryMethod}
						deliveryFee={deliveryFee}
						selectedLocation={selectedLocation}
						products={cartItems}
						totalAmount={totalPrice}
						discounts={discounts}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="Cart">
			<div className="LeftCart">
				<CartLeft
					cartItems={cartItems}
					handleIncreaseQuantity={handleIncreaseQuantity}
					handleDecreaseQuantity={handleDecreaseQuantity}
					handleQuantityChange={handleQuantityChange}
					handleRemoveItem={handleRemoveItem}
					error={error}
				/>
			</div>
			{isCartEmpty ? (
				<div className="RightCart">
					<Skeleton active paragraph={{ rows: 10 }} />
				</div>
			) : (
				<div className="RightCart">
					<Box
						sx={{ width: "100%", backgroundColor: "#f9f9f9", padding: "20px" }}
					>
						<Stepper
							linear
							activeStep={activeStep}
							sx={{ backgroundColor: "transparent" }}
						>
							{steps.map((label, index) => (
								<Step key={label}>
									<StepButton
										color="success"
										onClick={() => setActiveStep(index)}
										completed={completed[index]}
									></StepButton>
								</Step>
							))}
						</Stepper>

						<div>
							{activeStep === steps.length ? (
								<React.Fragment>
									<Typography sx={{ mt: 2, mb: 1 }}>
										Order placed successfully!
									</Typography>
									<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
										<Box sx={{ flex: "1 1 auto" }} />
										<Button variant="contained" onClick={handleReset}>
											<i className="fas fa-download"></i> Receipt
										</Button>
									</Box>
								</React.Fragment>
							) : (
								<React.Fragment>
									<Typography sx={{ mt: 2, mb: 0.5, py: 0.5 }}>
										Step {activeStep + 1}: {steps[activeStep]}
									</Typography>
									{renderStepContent()}
									<div className="CartTotal">
										{activeStep !== 2 && (
											<strong>
												<span>Total:</span>
												<span>{totalDisplay}</span>
											</strong>
										)}
									</div>
								</React.Fragment>
							)}
						</div>
						{error && <div className="error">{error}</div>}
					</Box>
				</div>
			)}
		</div>
	);
};

export default Cart;
