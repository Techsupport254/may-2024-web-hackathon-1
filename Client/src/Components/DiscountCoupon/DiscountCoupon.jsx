import { Button, InputAdornment, TextField } from "@mui/material";
import "./DiscountCoupon.css";
import axios from "axios";
import { useState, useEffect, useCallback, useContext } from "react";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import { ApiContext } from "../../Context/ApiProvider"; // Assuming you have a context for user data

const DiscountCoupon = ({ discounts, setDiscounts, setError, totalAmount }) => {
	const { userData } = useContext(ApiContext);
	const [discountCode, setDiscountCode] = useState("");
	const [discountValidity, setDiscountValidity] = useState(null);
	const [checkingDiscount, setCheckingDiscount] = useState(false);
	const [discountAmount, setDiscountAmount] = useState(0);
	const [discountPercentage, setDiscountPercentage] = useState(0);

	const checkDiscountValidity = async (code) => {
		setCheckingDiscount(true);
		try {
			const response = await axios.post(
				`http://localhost:8000/discounts/status/${code}`,
				{ userId: userData._id }
			);
			if (response.data.status) {
				setDiscountValidity(response.data.status);
				setError("");
				if (response.data.status === "Active") {
					const discount = await axios.get(
						`http://localhost:8000/discounts/code/${code}`
					);
					setDiscountPercentage(discount.data.discountPercentage);
					setDiscountAmount(
						(discount.data.discountPercentage / 100) * totalAmount
					);
				}
			} else {
				setDiscountValidity("Invalid");
				setError("Invalid discount code");
			}
		} catch (error) {
			setDiscountValidity("Invalid");
			setError("Invalid discount code");
		}
		setCheckingDiscount(false);
	};

	// Debounce the API call to avoid too many requests
	const debouncedCheckDiscount = useCallback(
		debounce(checkDiscountValidity, 500),
		[]
	);

	useEffect(() => {
		if (discountCode) {
			debouncedCheckDiscount(discountCode);
		} else {
			setDiscountValidity(null);
			setError("");
		}
	}, [discountCode, debouncedCheckDiscount, setError]);

	const applyDiscount = () => {
		if (discountValidity === "Active") {
			// Check if the discount code has already been used
			const existingDiscount = discounts.find(
				(discount) => discount.code === discountCode
			);
			if (existingDiscount) {
				setError("This discount code has already been used");
			} else {
				setDiscounts([
					...discounts,
					{
						code: discountCode,
						percentage: discountPercentage,
						amount: discountAmount,
					},
				]);
				setDiscountCode("");
				setDiscountValidity(null);
				setError("");
			}
		} else {
			setError("Invalid discount code");
		}
	};

	return (
		<div className="DiscountCoupon">
			<TextField
				placeholder="Discount Coupon"
				size="small"
				className="DiscountCouponInput"
				fullWidth
				value={discountCode}
				onChange={(e) => setDiscountCode(e.target.value)}
				InputProps={{
					startAdornment: discountCode && (
						<InputAdornment position="start">
							{checkingDiscount ? (
								<i className="fas fa-spinner fa-spin"></i>
							) : discountValidity === "Active" ? (
								<i className="fas fa-check Active"></i>
							) : discountValidity === "Expired" ? (
								<p className="Expired">Expired</p>
							) : discountValidity === "Used" ? (
								<p className="Used">Used</p>
							) : discountValidity === "Invalid" ? (
								<p className="Invalid">Invalid</p>
							) : null}
						</InputAdornment>
					),
					endAdornment: discountValidity === "Active" && (
						<InputAdornment position="end">
							<Button
								size="small"
								style={{
									backgroundColor: "var(--primary)",
									color: "white",
									fontSize: ".8rem",
									width: "2rem",
									height: "1.5rem",
									textTransform: "none",
								}}
								variant="contained"
								onClick={applyDiscount}
							>
								Apply
							</Button>
						</InputAdornment>
					),
				}}
			/>
			<div className="DiscountItem">
				{discountValidity === "Active" && (
					<p>
						{discountPercentage}% off up to KES.{" "}
						{discountAmount
							.toFixed(2)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
						discount
					</p>
				)}
				{discounts.map((discount, index) => (
					<p key={index}>
						{discount.code} - {discount.percentage}% off up to KES.{" "}
						{discount.amount
							.toFixed(2)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
						discount
					</p>
				))}
			</div>
		</div>
	);
};

DiscountCoupon.propTypes = {
	discounts: PropTypes.array.isRequired,
	setDiscounts: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	totalAmount: PropTypes.number.isRequired,
};

export default DiscountCoupon;
