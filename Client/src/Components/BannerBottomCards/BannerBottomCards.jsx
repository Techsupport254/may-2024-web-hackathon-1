import React, { useRef } from "react";
import BannerBottomCard from "../BannerBottomCard/BannerBottomCard";
import "./BannerBottomCards.css";
import { BannerBottomData } from "../../Data";

const BannerBottomCards = () => {
	const cardContainerRef = useRef(null);

	const scrollNext = () => {
		cardContainerRef.current.scrollLeft += cardContainerRef.current.offsetWidth;
	};

	const scrollPrev = () => {
		cardContainerRef.current.scrollLeft -= cardContainerRef.current.offsetWidth;
	};

	return (
		<div className="BannerBottomCards">
			<div className="TopPart">
				<h3>Suggested for you</h3>
				<button>
					See all
					<i className="fas fa-chevron-right"></i>
				</button>
			</div>
			<div className="BottomCards">
				<div className="NextPrevButton" onClick={scrollPrev}>
					<i className="fas fa-chevron-left"></i>
				</div>
				<div className="BannerCards" ref={cardContainerRef}>
					{BannerBottomData.map((card) => (
						<BannerBottomCard key={card.id} data={card} />
					))}
				</div>
				<div className="NextPrevButton" onClick={scrollNext}>
					<i className="fas fa-chevron-right"></i>
				</div>
			</div>
		</div>
	);
};

export default BannerBottomCards;
