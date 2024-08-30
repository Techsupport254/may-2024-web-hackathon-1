import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import Logo from "../../assets/logo.png";
import "./PaymentCallback.css";

const PaymentCallback = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const trxref = queryParams.get("trxref") || queryParams.get("reference"); // Handle both cases
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
				const data = response.data;
				setPaymentData(data);
				const paymentStatus = data?.order?.payment?.status || data.status;

				console.log("Payment Status:", paymentStatus);

				switch (paymentStatus) {
					case "Paid":
					case "success":
						setVerificationStatus("success");
						break;
					case "Pending":
					case "pending":
					case "failed":
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

	const getCurrencyFormattedAmount = (amount) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "KES",
		}).format(amount);
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
								<p>
									{paymentData?.order?.payment?.status || paymentData?.status}
								</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Receipt Number</span>
								<p>{paymentData?.order?.orderId}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Transaction Channel</span>
								<p>{paymentData?.order?.payment?.method}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Transaction Date</span>
								<p>
									{new Date(paymentData?.order?.payment?.date).toLocaleString(
										"en-NG"
									)}
								</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Customer Name</span>
								<p>{paymentData?.order?.customer?.name}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Customer Email</span>
								<p>{paymentData?.order?.customer?.email}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Customer Phone</span>
								<p>{paymentData?.order?.customer?.phone}</p>
							</div>
							<div className="ReceiptItem FlexDisplay">
								<span>Products Purchased</span>
								<table>
									<thead>
										<tr>
											<th>Product Name</th>
											<th>Quantity</th>
											<th>Price (kes)</th>
											<th>Total (kes)</th>
										</tr>
									</thead>
									<tbody>
										{paymentData?.order?.products.map((product, index) => (
											<tr key={index}>
												<td>{product.productName}</td>
												<td>{product.quantity}</td>
												<td>
													{getCurrencyFormattedAmount(
														product.price,
														paymentData?.order?.currency
													)}
												</td>
												<td>
													{getCurrencyFormattedAmount(
														product.price * product.quantity,
														paymentData?.order?.currency
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="ReceiptItem AmountPaid FlexDisplay">
								<span>Amount Paid</span>
								<p>
									{getCurrencyFormattedAmount(
										paymentData?.order?.amounts?.totalAmount,
										paymentData?.order?.currency
									)}
								</p>
							</div>
						</div>
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								window.location.href = "/orders";
							}}
							style={{
								backgroundColor: "var(--success-dark)",
								"&:hover": {
									backgroundColor: "var(--success-darker)",
								},
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
