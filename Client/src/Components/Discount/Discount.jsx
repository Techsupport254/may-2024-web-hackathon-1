import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Discount.css";

const Discount = ({ product, userData }) => {
	const calculateTimeLeft = (expiryDate) => {
		const difference = expiryDate - new Date();
		const days = Math.floor(difference / (1000 * 60 * 60 * 24));
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((difference / (1000 * 60)) % 60);
		const seconds = Math.floor((difference / 1000) % 60);
		return { days, hours, minutes, seconds };
	};

	const [expiryDate, setExpiryDate] = useState(() => {
		const currentDate = new Date();
		const threeDaysLater = new Date(currentDate);
		threeDaysLater.setDate(currentDate.getDate() + 3);
		return threeDaysLater;
	});
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiryDate));

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft(expiryDate));
		}, 1000);
		return () => clearInterval(timer);
	}, [expiryDate]);

	return (
		<div className="DiscountContainer">
			<div className="DiscountLeft">
				<div className="Warning">
					<h1>Hurry Up !</h1>
				</div>
				<div className="DiscountText">
					<h1> Up To 25% Discount</h1>
					<h1>Check it Out</h1>
				</div>
				<div className="Counter">
					{Object.entries(timeLeft).map(([unit, value]) => (
						<div className="CounterButton" key={unit}>
							<motion.span
								animate={{ scale: [1, 1.2, 1] }}
								transition={{ duration: 1 }}
							>
								{value}
							</motion.span>
							<h3>{unit.charAt(0).toUpperCase() + unit.slice(1)}</h3>
						</div>
					))}
				</div>
				<div className="ShopNow">
					<button>Shop Now</button>
				</div>
			</div>
			<div className="DiscountRight">
				<span>{product?.productName} </span>
				<p>
					{product?.productDescription.substring(0, 200)}
					<small>...</small>
				</p>
				<div className="DiscountImage">
					<img src={product?.images[1]} alt={product?.productName} />
				</div>
			</div>
		</div>
	);
};

export default Discount;
