import React from "react";
import "./Footer.css";
import { TextField } from "@mui/material";
// import Logo from "../../assets/logo.png";

const Footer = () => {
	return (
		<footer>
			<div className="FooterContainer">
				<div className="FooterLogo">
					<img
						src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png"
						alt="logo"
					/>
					<span>
						Agri<span>solve</span>
					</span>
				</div>
				<div className="FooterContent">
					<div className="FooterItems">
						<h3>Get to Know Us</h3>
						<a href="">Careers</a>
						<a href="">Blog</a>
						<a href="">About Us</a>
						<a href="">Investor Relations</a>
						<a href="">Agrisolve Products</a>
					</div>
					<div className="FooterItems">
						<h3>Make Money with Us</h3>
						<a href="">Sell products with Us</a>
						<a href="">Offer consultation Services</a>
						<a href="">Partner with Us</a>
						<a href="">See more ways</a>
					</div>
					<div className="FooterItems">
						<h3>Let Us help You</h3>
						<a href="">Your Account</a>
						<a href="">Your Orders</a>
						<a href="">Shipping Rates & Policies</a>
						<a href="">Return & Replacements</a>
						<a href="">Agrisolve Consultations</a>
					</div>
					<div className="FooterItems">
						<h3>Agrisolve Payments</h3>
						<a href="">Powered by Paystack</a>
						<a href="">Mpesa Supported</a>
						<a href="">Bank Payments Supported</a>
						<a href="">Payment on Delivery Supported</a>
					</div>
				</div>
			</div>
			<div className="Developer">
				<div className="DeveloperContainer">
					<div className="RightsReserved">
						<p>© 2024 Agrisolve. All rights reserved.</p>
						<p>
							<a href="">Privacy Policy</a>
						</p>
						<p>
							<a href="">Terms of Use</a>
						</p>
						<p>
							<a href="">Contact Us</a>
						</p>
					</div>
					<div className="DeveloperContent">
						<p>Developed by</p>
						<p>
							<a href="https://quaint.kitchen360.co.ke/">Victor Kirui</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
