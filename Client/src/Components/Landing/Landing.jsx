import React from "react";
import "./Landing.css";
import Farm from "../../assets/farm.png";
import MaskedImage from "./MaskedImage";

const Landing = ({ product }) => {
	return (
		<div className="Landing">
			<div className="LandingContainer">
				<div className="LandingLeft">
					<h1>Agrisolve</h1>
					<span>Sales upto 25% off</span>
					<p>
						Agrisolve is a platform that connects farmers to buyers and sellers
						of agricultural products and services. It also provides a platform
						for farmers to get agricultural advice from experts. We are here to
						help you grow.
					</p>
					<div className="LandingBtns">
						<button
							onClick={() => {
								window.location.href = "/products";
							}}
						>
							<i className="fas fa-shopping-cart"></i>
							Shop Now
						</button>
						<button
							onClick={() => {
								window.location.href = "/register";
							}}
						>
							Get Started
						</button>
					</div>
				</div>
				<div className="LandingRight">
					<div className="LandingImage">
						<img src={Farm} alt="Farm" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Landing;
