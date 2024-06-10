import { useState, useContext } from "react";
import "./Pay.css";
import { Modal } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { ApiContext } from "../../Context/ApiProvider";

const Pay = ({
	totalPrice,
	handleNext,
	products,
	deliveryFee,
	deliveryMethod,
	selectedLocation,
}) => {
	const { userData } = useContext(ApiContext);
	const [loading, setLoading] = useState(false);
	const [paying, setPaying] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [pendingPayment, setPendingPayment] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("");
	const [tax, setTax] = useState(0);
	const [isPaid, setIsPaid] = useState(false); // Add isPaid state

	const defaultBillingAddress = {
		street: "123 Main St",
		city: "Nairobi",
		state: "Nairobi",
		zipCode: "00100",
		country: "Kenya",
	};

	const defaultShippingAddress = {
		street: "123 Main St",
		city: "Nairobi",
		state: "Nairobi",
		zipCode: "00100",
		country: "Kenya",
	};

	const handleOpenModal = () => {
		setOpenModal(true);
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setPendingPayment(true);
		}, 2000);
	};

	const handlePayment = async () => {
		try {
			setPaying(true);

			if (!userData?._id) {
				throw new Error("User ID is not available");
			}
			if (!products || products.length === 0) {
				throw new Error("Products are not available");
			}

			const username = userData?.username;
			const uid = Date.now();
			const orderId = `${username}-${uid}`;

			const paymentData = {
				amount: parseFloat((totalPrice + deliveryFee + tax).toFixed(2)),
				email: userData?.email,
				orderId: orderId,
				userId: userData._id,
				paymentMethod: paymentMethod,
				deliveryMethod: deliveryMethod,
				products: products,
				location: selectedLocation?.display_name,
				reason: "Payment for products",
				number: userData?.phone || "",
				holder: userData?.name || "",
				billingAddress: defaultBillingAddress,
				shippingAddress: defaultShippingAddress,
				totalAmount: parseFloat((totalPrice + deliveryFee + tax).toFixed(2)),
				tax: parseFloat(tax.toFixed(2)),
				deliveryFee: parseFloat(deliveryFee.toFixed(2)),
				discounts: [],
			};

			console.log("Payment Data:", paymentData);

			const response = await axios.post(
				"http://localhost:8000/payment/initiate-payment",
				paymentData
			);

			if (response.status === 200 && response.data.paymentUrl) {
				console.log(
					"Payment initiated successfully. Redirecting to payment gateway..."
				);
				window.location.href = response.data.paymentUrl;
			} else {
				throw new Error("Unable to initiate payment");
			}
		} catch (error) {
			console.error("Error initiating payment:", error);
			setPaying(false);
			Modal.error({
				title: "Payment Error",
				content: error.message || "There was an error initiating your payment.",
			});
		}
	};

	const checkPaymentStatus = async (orderId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/payment/status/${orderId}`
			);

			if (response.status === 200) {
				const paymentStatus = response.data.status;
				setPaying(false);

				switch (paymentStatus) {
					case "success":
						console.log("Payment successful");
						setIsPaid(true); // Set isPaid to true on successful payment
						break;
					case "failed":
						console.error("Payment failed");
						break;
					case "cancelled":
						console.error("Payment was cancelled by the user");
						break;
					default:
						console.error("Unknown payment status");
				}
			} else {
				throw new Error("Unable to check payment status");
			}
		} catch (error) {
			console.error("Error checking payment status:", error);
			setPaying(false);
			Modal.error({
				title: "Payment Error",
				content: "There was an error checking the payment status.",
			});
		}
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
							<span>Delivery Method:</span>
							<p
								style={{
									textTransform: "capitalize",
								}}
							>
								{deliveryMethod && deliveryMethod}
							</p>
						</div>
						<div className="SummaryRow">
							{deliveryMethod !== "pickup" ? (
								<>
									<span>Delivery Location:</span>
									<p>{selectedLocation?.display_name}</p>
								</>
							) : (
								<>
									<span>Pickup Location:</span>
									<p>{selectedLocation?.display_name}</p>
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

Pay.propTypes = {
	totalPrice: PropTypes.number.isRequired,
	handleNext: PropTypes.func.isRequired,
	products: PropTypes.array.isRequired,
	deliveryFee: PropTypes.number.isRequired,
	deliveryMethod: PropTypes.string.isRequired,
	selectedLocation: PropTypes.object,
};

export default Pay;
