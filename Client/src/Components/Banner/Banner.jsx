import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import {
	EffectCoverflow,
	Pagination,
	Navigation,
	Autoplay,
} from "swiper/modules";
import "./Banner.css";
import BannerCard from "../BannerCard/BannerCard";
import propTypes from "prop-types";

const Banner = ({ products, userData }) => {
	return (
		<div className="BannerContainer">
			<div className="ProfileRecommendations">
				{userData ? (
					<img
						src={userData?.profilePicture}
						alt="profile"
						className="ProfilePicture"
					/>
				) : null}
				<div className="ProfileDet">
					<span>Hi, {userData?.name ? userData.name : "user"}</span>
					<p>Recommendations just for you👇</p>
				</div>
			</div>
			<Swiper
				effect={"coverflow"}
				grabCursor={true}
				centeredSlides={true}
				loop={true}
				slidesPerView={"auto"}
				coverflowEffect={{
					rotate: 0,
					stretch: 0,
					depth: 100,
					modifier: 2.5,
					slideShadows: true,
				}}
				pagination={{ el: ".swiper-pagination", clickable: true }}
				navigation={{
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
					clickable: true,
				}}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
				modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
				className="swiper_container"
			>
				{products.map((product, index) => (
					<SwiperSlide key={index}>
						<BannerCard product={product} userData={userData} />
					</SwiperSlide>
				))}
			</Swiper>
			<div className="slider-controler">
				<div className="swiper-button-prev slider-arrow">
					<ion-icon name="arrow-back-outline" className="nav-icon"></ion-icon>
				</div>
				<div className="swiper-pagination"></div>
				<div className="swiper-button-next slider-arrow">
					<ion-icon
						name="arrow-forward-outline"
						className="nav-icon"
					></ion-icon>
				</div>
			</div>
		</div>
	);
};

export default Banner;

Banner.propTypes = {
	products: propTypes.array.isRequired,
	userData: propTypes.object.isRequired,
};
