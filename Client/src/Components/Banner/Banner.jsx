import React from "react";
import "./Banner.css";
import BannerCard from "../BannerCard/BannerCard";

const Banner = ({ products, userData }) => {
	return (
		<div className="BannerContainer">
			{products.map((product) => (
				<div className="BannerCard">
					<BannerCard product={product} userData={userData} />
				</div>
			))}
		</div>
	);
};

export default Banner;
