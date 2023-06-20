import React from "react";
import "./BannerBottomCard.css";

const BannerBottomCard = ({ data }) => {
	return (
		<div className="BannerBottomCard">
			<div className="CardImage">
				<img src={data.image} alt={data.title} />
			</div>
			<div className="CardContent">
				<h4>{data.title}</h4>
                <span>{data.category}</span>
				<p>Amount: KSh.{data.amount}</p>

			</div>
		</div>
	);
};

export default BannerBottomCard;
