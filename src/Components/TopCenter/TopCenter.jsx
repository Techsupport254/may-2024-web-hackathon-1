import React, { useState, useEffect } from "react";
import "./TopCenter.css";
import { BannerCenterData } from "../../Data";

const TopCenter = () => {
	const [currentPage, setCurrentPage] = useState(0);

	const handlePrevPage = () => {
		setCurrentPage(
			(prevPage) =>
				(prevPage - 1 + BannerCenterData.length) % BannerCenterData.length
		);
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => (prevPage + 1) % BannerCenterData.length);
	};

	const currentItem = BannerCenterData[currentPage];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentPage((prevPage) => (prevPage + 1) % BannerCenterData.length);
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="TopCenter">
			<h3>Offers</h3>
			<div className="TopCenterItems">
				<div className="TopCenterItem active">
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
			</div>
			<div className="PrevNextButtons">
				<div className="TopCenterButton" onClick={handlePrevPage}>
					<i className="fas fa-chevron-left"></i>
				</div>
				<div className="PaginationDots">
					{BannerCenterData.map((_, index) => (
						<div
							key={index}
							className={index === currentPage ? "Dot active" : "Dot"}
						></div>
					))}
				</div>
				<div className="TopCenterButton" onClick={handleNextPage}>
					<i className="fas fa-chevron-right"></i>
				</div>
			</div>
		</div>
	);
};

export default TopCenter;
