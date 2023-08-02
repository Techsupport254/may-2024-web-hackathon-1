import React from "react";

const Offer = ({ currentItem }) => {
	return (
		<div className="Offer">
			<div className="ItemImage">
				<img src={currentItem.image} alt={currentItem.title} />
			</div>
			<div className="RightDetails">
				<div className="ItemTitle">
					<span>{currentItem.title}</span>
				</div>
				<div className="ItemAmount">
					<span>KSh.{currentItem.amount}</span>
					<span>KSh.{currentItem.prevAmount}</span>
				</div>
				<div className="ItemDescription">
					<p>{currentItem.description}</p>
				</div>
			</div>
		</div>
	);
};

export default Offer;
