import React, { useState } from "react";
import "./Pay.css";
import { cartData } from "../../Data";
import Button from "@mui/material/Button";

const Pay = ({ totalPrice, handleNext }) => {
	const [isPaid, setIsPaid] = useState(false);
	const [cartItems, setCartItems] = useState(
		cartData.map((item) => ({ ...item, quantity: item.quantity || 1 }))
	);
	const [openModal, setOpenModal] = useState(false);
	const [pendingPayment, setPendingPayment] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [deliveryMethod, setDeliveryMethod] = useState(null);

	const handleOpenModal = () => {
		setOpenModal(true);
		setPendingPayment(true);
	};

	const handlePayment = () => {
		setIsPaid(true);
		// Generate receipt or perform other actions
		// ...
	};

	const handleBack = () => {
		setPendingPayment(false);
		setOpenModal(false);
	};

	const handleSaveAndNext = () => {
		setPendingPayment(false);
		setOpenModal(false);
		handleNext();
	};

	const tax = 0;
	const deliveryFee = 100;
	const totalAmount = totalPrice + tax + deliveryFee;

	return (
		<div className="Pay">
			{!pendingPayment && !isPaid && <h3>Payment Details</h3>}
			{!pendingPayment && !isPaid && (
				<div className="PaymentSummary">
					<div className="SummaryRow">
						<span>Total Amount:</span>
						<span>KSh.{totalPrice.toFixed(2)}</span>
					</div>
					<div className="SummaryRow">
						<span>Tax:</span>
						<span>KSh.{tax}</span>
					</div>
					<div className="SummaryRow">
						<span>Delivery Fee:</span>
						<span>KSh.{deliveryFee}</span>
					</div>
					<div className="SummaryRow TotalRow">
						<span>Grand Total:</span>
						<span>KSh.{totalAmount.toFixed(2)}</span>
					</div>
				</div>
			)}
			{pendingPayment && (
				<div className="ModalContent">
					<h3> Confirm Payment Details</h3>
					<div className="PaymentSummary">
						<div className="SummaryRow">
							<span>Payment Method:</span>
							<p>M-Pesa</p>
						</div>
						<div className="SummaryRow">
							<span>Phone Number:</span>
							<p>0712345678</p>
						</div>
						<div className="SummaryRow">
							<span>Delivery Method</span>
							<p>Delivery</p>
						</div>
						<div className="SummaryRow">
							<span>Total Amount:</span>
							<p>KSh.{totalPrice.toFixed(2)}</p>
						</div>
						<div className="SummaryRow">
							<span>Tax:</span>
							<p>KSh.{tax}</p>
						</div>
						<div className="SummaryRow">
							<span>Delivery Fee:</span>
							<p>KSh.{deliveryFee}</p>
						</div>
						<div className="SummaryRow TotalRow">
							<span>Grand Total:</span>
							<p>KSh.{totalAmount.toFixed(2)}</p>
						</div>
					</div>
				</div>
			)}
			<div
				className="Buttons"
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: "20px",
				}}
			>
				<Button
					variant="outlined"
					onClick={handleBack}
					disabled={!pendingPayment}
				>
					Back
				</Button>
				<Button
					variant="contained"
					onClick={handleSaveAndNext}
					disabled={!paymentMethod || !deliveryMethod}
				>
					Next
				</Button>
			</div>
			{!pendingPayment && !isPaid && (
				<div className="PayBtn">
					<button className="PayButton" onClick={handleOpenModal}>
						Pay Now
					</button>
				</div>
			)}
			{pendingPayment && !isPaid && (
				<div className="PayBtn">
					<button className="PayButton" onClick={handlePayment}>
						Confirm Payment
					</button>
				</div>
			)}
			{isPaid && (
				<div className="">
					<button className="PayButton">
						<i className="fas fa-download"></i> Download Receipt
					</button>
				</div>
			)}
		</div>
	);
};

export default Pay;
