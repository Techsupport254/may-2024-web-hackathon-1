import React from "react";
import "./Footer.css";

const Footer = () => {
	return (
		<footer>
			<div className="FooterContainer">
				<div className="FooterLogo">
					<img
						src="https://th.bing.com/th/id/OIP.kl96ZWbZQTjPvNOPNGbUOQHaFO?w=317&h=181&c=7&r=0&o=5&dpr=1.5&pid=1.7"
						alt="logo"
					/>
					<span>Agrisolve</span>
				</div>
				<div className="FooterContent">
					<div className="FooterServices">
						<h3>Services</h3>
						<div className="ServiceItem">
							<i className="fas fa-check"></i>
							<span>Agricultural E-commerce</span>
						</div>
						<div className="ServiceItem">
							<i className="fas fa-check"></i>
							<span>Agricultural Community Support</span>
						</div>
						<div className="ServiceItem">
							<i className="fas fa-check"></i>
							<span>Agricultural E-commerce</span>
						</div>
						<div className="ServiceItem">
							<i className="fas fa-check"></i>
							<span>Agricultural E-commerce</span>
						</div>
					</div>
					<div className="FooterLinks">
						<h3>Links</h3>
						<div className="LinkItem">
							<i className="fas fa-link"></i>
							<span>Home</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
