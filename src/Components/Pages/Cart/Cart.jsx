import React, { useState, useEffect } from "react";
import "./Cart.css";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Info from "../../Info/Info";
import Pay from "../../Pay/Pay";
import Payment from "../../Payment/Payment";
import CartLeft from "../../CartLeft/CartLeft";

const steps = ["Payment and Delivery Methods", "Fill Information", "Payment"];

const Cart = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [deliveryMethod, setDeliveryMethod] = useState(null);

	// fetch cart items from local storage
	const [cartItems, setCartItems] = useState(
		JSON.parse(localStorage.getItem("cart")) || []
	);

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cartItems));
	}, [cartItems]);

	const totalPrice = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const handleIncreaseQuantity = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
			)
		);
	};

	const handleDecreaseQuantity = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId && item.quantity > 1
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
		);
	};

	const handleRemoveItem = (itemId) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

		// Update local storage to reflect changes
		const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
		localStorage.setItem("cart", JSON.stringify(updatedCartItems));

		// Reload the cart from local storage
		const reloadedCart = JSON.parse(localStorage.getItem("cart"));
		setCartItems(reloadedCart);
	};

	const totalSteps = () => {
		return steps.length;
	};

	const isLastStep = () => {
		return activeStep === totalSteps() - 1;
	};

	const handleNext = (paymentMethod, deliveryMethod) => {
		if (paymentMethod && deliveryMethod) {
			setPaymentMethod(paymentMethod);
			setDeliveryMethod(deliveryMethod);

			console.log("Payment Method: ", paymentMethod);
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

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return (
					<Info
						handleNext={handleNext}
						handleBack={handleBack}
						isLastStep={isLastStep()}
					/>
				);
			case 1:
				return (
					<Payment
						handleNext={handleNext} // Add this line to pass handleNext as prop
						handleBack={handleBack} // Add this line to pass handleBack as prop
						paymentMethod={paymentMethod} // Pass the paymentMethod prop if needed
						deliveryMethod={deliveryMethod} // Pass the deliveryMethod prop if needed
					/>
				);
			case 2:
				return <Pay totalPrice={totalPrice} />;
			default:
				return null;
		}
	};

	return (
		<div className="Cart">
			<div className="LeftCart">
				<CartLeft
					totalPrice={totalPrice}
					cartItems={cartItems}
					handleIncreaseQuantity={handleIncreaseQuantity}
					handleDecreaseQuantity={handleDecreaseQuantity}
					handleRemoveItem={handleRemoveItem}
				/>
			</div>
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
										<i className="fas fa-download"></i>
										Receipt
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
										<strong>Total: KSh.{totalPrice.toFixed(2)}</strong>
									)}
								</div>
							</React.Fragment>
						)}
					</div>
				</Box>
			</div>
		</div>
	);
};

export default Cart;
