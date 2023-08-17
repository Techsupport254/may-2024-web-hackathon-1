import React from "react";
import "./Banner.css";
import BannerCard from "../BannerCard/BannerCard";

const Banner = ({ products }) => {
	return (
		<div className="BannerContainer">
			{products.map((product) => (
				<div className="BannerCard">
					<BannerCard product={product} />
				</div>
			))}
		</div>
	);
};

export default Banner;
