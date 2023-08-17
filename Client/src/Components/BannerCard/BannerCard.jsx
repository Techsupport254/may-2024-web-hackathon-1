import React from "react";
import "./BannerCard.css";

const BannerCard = ({ product }) => {
	return (
		<div className="BannerCardContainer">
			<div className="BannerCardImage">
				<img src={product.images[0]} alt={product.name} />
			</div>
			<div className="BannerCardDetails">
				<h3>{product.productName}</h3>
				<p>KSh.{product.price}</p>
			</div>
		</div>
	);
};

export default BannerCard;
