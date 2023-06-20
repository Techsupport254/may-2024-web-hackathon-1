import React, { useState } from "react";
import "./Info.css";
import Button from "@mui/material/Button";

const Info = ({ handleNext, handleBack, isLastStep }) => {
	const [paymentMethod, setPaymentMethod] = useState("");
	const [deliveryMethod, setDeliveryMethod] = useState("");
	const [isSaved, setIsSaved] = useState(false);

	const handlePaymentMethodChange = (event) => {
		setPaymentMethod(event.target.value);
	};

	const handleDeliveryMethodChange = (event) => {
		setDeliveryMethod(event.target.value);
	};

	const handleSaveAndNext = () => {
		// save paymentMethod and deliveryMethod to local storage as object
		localStorage.setItem(
			"AgrisolveMethods",
			JSON.stringify({ paymentMethod, deliveryMethod })
		);
		setIsSaved(true);
		handleNext(paymentMethod, deliveryMethod); // Pass paymentMethod and deliveryMethod as props
	};

	return (
		<div className="Info">
			<div className="PaymentMethod">
				<h3>Payment Method</h3>
				<select value={paymentMethod} onChange={handlePaymentMethodChange}>
					<option value="">Select payment method</option>
					<option value="mpesa">Mpesa</option>
					<option value="bank">Bank</option>
					<option value="paypal">PayPal</option>
					<option value="cod">Cash On Delivery</option>
				</select>
			</div>
			<div className="DeliveryMethod">
				<h3>Delivery Method</h3>
				<select value={deliveryMethod} onChange={handleDeliveryMethodChange}>
					<option value="">Select delivery method</option>
					<option value="standard">Standard</option>
					<option value="express">Express</option>
					<option value="Pick-up">Pick-up</option>
				</select>
			</div>
			<div
				className="Buttons"
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: "20px",
				}}
			>
				<Button variant="outlined" onClick={handleBack} disabled>
					Back
				</Button>
				<Button
					variant="contained"
					onClick={handleSaveAndNext}
					disabled={!paymentMethod || !deliveryMethod}
				>
					{isSaved ? "Saved!" : isLastStep ? "Finish" : "Next"}
				</Button>
			</div>
		</div>
	);
};

export default Info;
