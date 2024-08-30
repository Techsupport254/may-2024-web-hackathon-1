import React, { useState, useEffect } from "react";
import "./Payment.css";
import { Modal, Button } from "antd";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AvailableLocations from "../AvailableLocations/AvailableLocations";
import DiscountCoupon from "../DiscountCoupon/DiscountCoupon";
import PropTypes from "prop-types";

const Payment = ({
	handleNext,
	handleBack,
	deliveryMethod,
	setDeliveryFee,
	deliveryFee,
	setSelectedLocation,
	selectedLocation,
	totalAmount,
	discounts,
	setDiscounts,
}) => {
	const [defaultLocation, setDefaultLocation] = useState(null);
	const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
	const [isLocationSelected, setIsLocationSelected] = useState(false);
	const [savedLocation, setSavedLocation] = useState([]);
	const [error, setError] = useState(null);

	// Set payment and delivery methods
	useEffect(() => {
		if (deliveryMethod) {
			setSelectedDeliveryMethod(deliveryMethod);
		}
	}, [deliveryMethod]);

	useEffect(() => {
		// Retrieve saved location from local storage
		const savedLocation = localStorage.getItem("selectedLocation");
		if (savedLocation) {
			setSelectedLocation(JSON.parse(savedLocation));
			setIsLocationSelected(true);
		}
	}, []);

	const handleSaveAndNext = () => {
		localStorage.setItem(
			"AgrisolveMethods",
			JSON.stringify({ deliveryMethod })
		);
		setIsLocationSelected(true);
		handleNext(deliveryMethod, deliveryFee, selectedLocation);
	};

	return (
		<div className="Payment">
			{error && (
				<p
					className="Error"
					style={{
						color: "red",
						fontSize: ".7rem",
					}}
				>
					{error}
				</p>
			)}
			<div className="DeliverySection">
				<div className="DeliveryProfile">
					<div className="TopSec">
						<h3>
							{deliveryMethod === "Pick-up" ? "Pick-up" : "Delivery"} Location
						</h3>
					</div>
				</div>
				<AvailableLocations
					selectedLocation={selectedLocation}
					setSelectedLocation={setSelectedLocation}
					setIsLocationSelected={setIsLocationSelected}
					isLocationSelected={isLocationSelected}
					setDeliveryFee={setDeliveryFee}
				/>
				{/* Discount code if there */}
				<div className="SummaryRow">
					<DiscountCoupon
						discounts={discounts}
						setDiscounts={setDiscounts}
						setError={setError}
						totalAmount={totalAmount}
					/>
				</div>
				<div
					className="Buttons"
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "20px",
					}}
				>
					<Button type="default" onClick={handleBack}>
						Back
					</Button>
					<Button
						type="primary"
						onClick={handleSaveAndNext}
						disabled={!isLocationSelected}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Payment;

// props
Payment.propTypes = {
	handleNext: PropTypes.func.isRequired,
	handleBack: PropTypes.func.isRequired,
	deliveryMethod: PropTypes.string.isRequired,
	setDeliveryFee: PropTypes.func.isRequired,
	deliveryFee: PropTypes.number.isRequired,
	setSelectedLocation: PropTypes.func.isRequired,
	selectedLocation: PropTypes.object.isRequired,
};
