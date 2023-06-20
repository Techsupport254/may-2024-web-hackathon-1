import React from "react";
import "./BannerTop.css";
import TopLeft from "../TopLeft/TopLeft";
import TopCenter from "../TopCenter/TopCenter";
import TopRight from "../TopRight/TopRight";

const BannerTop = () => {
	return (
		<div className="BannerTop">
			<div className="BannerLeft">
				<TopLeft />
			</div>
			<div className="BannerCenter">
				<TopCenter />
			</div>
			<div className="BannerRight">
				<TopRight />
			</div>
		</div>
	);
};

export default BannerTop;
