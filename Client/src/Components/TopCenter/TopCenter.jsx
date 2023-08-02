import React, { useEffect, useState } from "react";
import "./TopCenter.css";
import { BannerCenterData } from "../../Data";
import { motion } from "framer-motion";
import Offer from "./Offer";

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
				<motion.div
					className="TopCenterItem active"
					initial={{ opacity: 0, x: 100 }}
					animate={{
						opacity: 1,
						x: 0,
						transition: { duration: 0.5, ease: "easeInOut" }, // Add smooth scrolling effect
					}}
					exit={{
						opacity: 0,
						x: -100,
						transition: { duration: 0.5, ease: "easeInOut" }, // Add smooth scrolling effect
					}}
				>
					<Offer currentItem={currentItem} />
				</motion.div>
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
