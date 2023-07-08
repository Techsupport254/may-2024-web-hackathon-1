import React from "react";
import "./Banner.css";
import BannerTop from "../BannerTop/BannerTop";
import BannerBottom from "../BannerBottom/BannerBottom";

const Banner = () => {
	return (
		<div className="Banner">
			<div className="BannersTop">
				<BannerTop />
			</div>
			<div className="BannersBottom">
				<BannerBottom />
			</div>
		</div>
	);
};

export default Banner;
