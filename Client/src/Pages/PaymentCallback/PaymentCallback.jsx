import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import Logo from "../../assets/Logo.png";
import "./PaymentCallback.css";

const PaymentCallback = ({ userData }) => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const trxref = queryParams.get("trxref");
	const reference = queryParams.get("reference");
	const [paymentData, setPaymentData] = useState(null);
	const [verificationStatus, setVerificationStatus] = useState("verifying");

	useEffect(() => {
		verifyTransaction();
	}, [trxref]);

	const verifyTransaction = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8000/payment/status/${trxref}`
			);
			if (response.status === 200) {
				setPaymentData(response.data);
				const paymentStatus = response.data.status;
				console.log(paymentStatus);
				switch (paymentStatus) {
					case "success":
						setVerificationStatus("success");
						break;
					case "pending":
					case "error":
					default:
						setVerificationStatus("error");
						break;
				}
			} else {
				setVerificationStatus("error");
			}
		} catch (error) {
			console.error("Verification error:", error);
			setVerificationStatus("error");
		}
	};

	return (
		<div className="PaymentCallback FlexDisplay">
			<div className="PaymentCont FlexDisplay">
				<div className="PaymentLogo FlexDisplay">
					<img src={Logo} alt="logo" />
					<span>
						Agri<span>solve</span>
					</span>
				</div>
				{verificationStatus === "verifying" ? (
					<div className="Verifying FlexDisplay">
						<CircularProgress color="inherit" />
						<h3>Verifying Payment...</h3>
					</div>
				) : verificationStatus === "success" ? (
					<div className="ReceiptCont FlexDisplay">
						<h3>Payment Successful</h3>
						<p>Your payment has been successful</p>
						<div className="ReceiptDetails FlexDisplay">
							<h3>Receipt Summary</h3>
							<div className="ReceiptItem FlexDisplay">
								<span>Transaction Reference</span>
								<p>{trxref}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Transaction Status</span>
								<p>{paymentData?.status}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Receipt Number</span>
								<p>{paymentData?.receipt_number}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Transaction Channel</span>
								<p>{paymentData?.channel}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Gateway Response</span>
								<p>{paymentData?.gateway_response}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Transaction Date</span>
								<p>{new Date(paymentData?.paid_at).toLocaleString("en-NG")}</p>
							</div>
							<div className="ReceiptItem AmountPaid FlexDisplay">
								<span>Amount Paid</span>
								<p>
									{new Intl.NumberFormat("en-NG", {
										style: "currency",
										currency: paymentData?.currency,
									}).format(paymentData?.amount / 100)}
								</p>
							</div>
						</div>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								window.location.href = "/orders";
							}}
						>
							Continue
						</Button>
					</div>
				) : (
					<div className="ReceiptCont FlexDisplay">
						<h3>Payment Failed</h3>
						<p>
							There was a problem verifying your payment. Please contact support
							or try again.
						</p>
						<Button
							variant="contained"
							onClick={() => {
								window.location.reload();
							}}
							style={{
								backgroundColor: "var(--bg-color)",
							}}
						>
							Retry
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentCallback;
