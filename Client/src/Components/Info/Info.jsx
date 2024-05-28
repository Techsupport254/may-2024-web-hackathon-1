import React, { useState } from "react";
import "./Info.css";
import Button from "@mui/material/Button";

const Info = ({ handleNext, handleBack, isLastStep }) => {
	const [deliveryMethod, setDeliveryMethod] = useState("");
	const [isSaved, setIsSaved] = useState(false);

	const handleDeliveryMethodChange = (event) => {
		setDeliveryMethod(event.target.value);
	};

	const handleSaveAndNext = () => {
		localStorage.setItem(
			"AgrisolveMethods",
			JSON.stringify({ deliveryMethod })
		);
		setIsSaved(true);
		handleNext(deliveryMethod);
	};


	return (
		<div className="Info">
			<div className="DeliveryMethod">
				<h3>Delivery Method</h3>
				<img
					src="https://img.icons8.com/color/48/000000/delivery.png"
					alt="delivery"
					className="DeliveryIcon"
				/>
				<select value={deliveryMethod} onChange={handleDeliveryMethodChange}>
					<option value="">Select delivery method</option>
					<option value="express">Express</option>
					<option value="standard">Standard</option>
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
					disabled={!deliveryMethod}
				>
					{isSaved ? "Saved!" : isLastStep ? "Finish" : "Next"}
				</Button>
			</div>
		</div>
	);
};

export default Info;
