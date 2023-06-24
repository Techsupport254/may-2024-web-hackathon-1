import React, { useEffect, useState } from "react";
import "./Pay.css";
import { cartData } from "../../Data";
import { Modal } from "antd";
import axios from "axios";

const Pay = ({ totalPrice, handleNext, userData }) => {
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const [loading, setLoading] = useState(false);
	const [paying, setPaying] = useState(false);
	const [isPaid, setIsPaid] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [pendingPayment, setPendingPayment] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [deliveryMethod, setDeliveryMethod] = useState("");

	const handleOpenModal = () => {
		setOpenModal(true);

		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setPendingPayment(true);
		}, 2000);
	};

	console.log(userData);

	const handlePayment = () => {
		setPaying(true);

		const username = userData.username;

		const uid = Date.now();

		const orderId = `${username}-${uid}`;
		console.log("Order ID: ", orderId);

		// Prepare the payment data to send to the server
		const paymentData = {
			phone: selectedAccount.phoneNumber,
			amount: totalAmount.toFixed(2),
			reason: `Payment for order ${orderId}`,
		};

		// Send a POST request to the server to create a new payment
		axios
			.post("http://localhost:4000/payment/stk", paymentData)
			.then((response) => {
				setPaying(false);

				Modal.success({
					title: "Payment Successful",
					content: "Your payment was successful",
					onOk: () => {
						setIsPaid(true);
					},
				});
			})
			.catch((error) => {
				console.error("Error making payment:", error);
				setPaying(false);
				Modal.error({
					title: "Payment Error",
					content: "There was an error processing your payment",
				});
			});
	};

	useEffect(() => {
		try {
			// fetch payment and delivery methods from local storage
			const paymentMethod = JSON.parse(localStorage.getItem("paymentMethod"));
			const deliveryMethod = JSON.parse(localStorage.getItem("deliveryMethod"));

			// fetch the selected Account and Location from local storage
			const selectedAccountJson = localStorage.getItem("selectedAccount");
			const selectedAccount = selectedAccountJson
				? JSON.parse(selectedAccountJson)
				: null;
			const selectedLocationJson = localStorage.getItem("selectedLocation");
			const selectedLocation = selectedLocationJson
				? JSON.parse(selectedLocationJson)
				: null;

			console.log("Selected Account: ", selectedAccount);
			console.log("Selected Location: ", selectedLocation);

			setPaymentMethod(paymentMethod);
			setDeliveryMethod(deliveryMethod);
			setSelectedAccount(selectedAccount);
			setSelectedLocation(selectedLocation);

			console.log("Payment Method: ", paymentMethod);
			console.log("Delivery Method: ", deliveryMethod);
			console.log(paymentMethod, deliveryMethod);
		} catch (error) {
			console.error("Error parsing JSON:", error);
		}
	}, []);

	const handleBack = () => {
		setPendingPayment(false);
		setOpenModal(false);
	};

	const handleSaveAndNext = () => {
		setPendingPayment(false);
		setOpenModal(false);
		handleNext();
	};

	const handleDownload = () => {
		Modal.success({
			title: "Download Successful",
			content: "Your receipt has been downloaded",
			onOk: () => {
				window.open(
					"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
				);
				setTimeout(() => {
					window.location.href = "/orders";
				}, 2000);
			},
		});
	};

	const tax = 100;
	const deliveryFee = 300;
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
				<div className="PayModal">
					<h3>Confirm Payment Details</h3>
					<div className="PaymentSummary">
						<div className="SummaryRow">
							<span>Payment Method:</span>
							<p
								style={{
									textTransform: "capitalize",
								}}
							>
								{paymentMethod ? paymentMethod : "Not Selected"}
							</p>
						</div>
						<div className="SummaryRow">
							{paymentMethod === "mpesa" && (
								<>
									<p>Phone Number:</p>
									<p>{selectedAccount.phoneNumber}</p>
								</>
							)}
							{paymentMethod === "bank" && (
								<>
									<p>Card Number:</p>
									<p>
										{selectedAccount.number &&
											selectedAccount.number
												.toString()
												.match(/.{1,4}/g)
												.join(" ")}
									</p>
								</>
							)}
							{paymentMethod === "paypal" && (
								<>
									<p>Paypal Email:</p>
									<p>{selectedAccount.email}</p>
								</>
							)}
						</div>

						<div className="SummaryRow">
							<span>Delivery Method:</span>
							<p
								style={{
									textTransform: "capitalize",
								}}
							>
								{deliveryMethod}
							</p>
						</div>
						<div className="SummaryRow">
							{deliveryMethod !== "pickup" ? (
								<>
									<span>Delivery Location:</span>
									<p>
										{selectedLocation.address}, {selectedLocation.city},{" "}
										{selectedLocation.county}
									</p>
								</>
							) : (
								<>
									<span>Pickup Location:</span>
									<p>
										{selectedLocation.address}, {selectedLocation.city},{" "}
										{selectedLocation.county}
									</p>
								</>
							)}
						</div>
						<div
							className="SummaryRow"
							style={{
								marginTop: "2rem",
								borderTop: "1px solid grey",
								paddingTop: "1rem",
							}}
						>
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
						<div
							className="SummaryRow TotalRow"
							style={{
								marginTop: "2rem",
								borderTop: "1px solid grey",
								paddingTop: "1rem",
							}}
						>
							<span>Grand Total:</span>
							<p>KSh.{totalAmount.toFixed(2)}</p>
						</div>
					</div>
				</div>
			)}
			{!pendingPayment && !isPaid && !paying && (
				<div className="PayBtn">
					<button className="PayButton" onClick={handleOpenModal}>
						{loading ? (
							<>
								<i className="fas fa-spinner fa-spin"></i>&nbsp; Please Wait...
							</>
						) : (
							<>
								<i className="fas fa-money-bill-wave"></i>&nbsp; Pay{" "}
								{totalAmount.toFixed(2)} Now
							</>
						)}
					</button>
				</div>
			)}
			{pendingPayment && !isPaid && !paying && (
				<div className="PayBtn">
					<button className="PayButton" onClick={handlePayment}>
						Confirm Payment
					</button>
				</div>
			)}
			{isPaid && (
				<div className="">
					<button className="PayButton" onClick={handleDownload}>
						<i className="fas fa-download"></i> Download Receipt
					</button>
				</div>
			)}
			{paying && (
				<div
					className="PayModal"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						border: "1px solid #ccc",
						padding: "20px",
						borderRadius: "5px",
					}}
				>
					{paying ? (
						<i
							className="fas fa-spinner fa-spin"
							style={{
								fontSize: "30px",
								marginBottom: "20px",
							}}
						></i>
					) : (
						<i
							className="fas fa-check"
							style={{
								fontSize: "30px",
								marginBottom: "20px",
							}}
						></i>
					)}
					<h3>Payment in progress...</h3>
				</div>
			)}
		</div>
	);
};

export default Pay;
