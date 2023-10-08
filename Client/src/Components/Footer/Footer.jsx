import React from "react";
import "./Footer.css";
import { TextField } from "@mui/material";

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
					<div className="PopularCategories">
						<h3>Popular Categories</h3>
						<div className="CategoryItem">
							<i className="fas fa-seedling"></i>
							<span>Seeds</span>
						</div>
						<div className="CategoryItem">
							<i className="fas fa-tractor"></i>
							<span>Farm Machinery</span>
						</div>
						<div className="CategoryItem">
							<i className="fas fa-tractor"></i>
							<span>Farm Machinery</span>
						</div>
						<div className="CategoryItem">
							<i className="fas fa-tractor"></i>
							<span>Farm Machinery</span>
						</div>
					</div>
					<div className="FooterContact">
						<h3>Contact</h3>
						<div className="ContactItem">
							<i className="fas fa-map-marker-alt"></i>
							<span>Juja, Kiambu, Nairobi</span>
						</div>
						<div className="ContactItem">
							<i className="fas fa-phone"></i>
							<span>+254 796 511 114</span>
						</div>
						<div className="ContactItem">
							<i className="fas fa-envelope"></i>
							<span>Kiruivictor097@gmail.com</span>
						</div>
						<div className="ContactItem">
							<TextField
								id="outlined-multiline-static"
								label="Subscribe to our newsletter"
								variant="outlined"
								size="small"
								color="success"
								style={{ width: "100%" }}
								// button input props
								InputProps={{
									endAdornment: (
										<i
											className="fas fa-paper-plane"
											style={{
												color: "green",
												marginLeft: "10px",
											}}
										></i>
									),
								}}
							/>
						</div>
					</div>
					<div className="FooterLinks">
						<h3>Links</h3>
						<div className="LinkItem">
							<i className="fas fa-home"></i>
							<span>Home</span>
						</div>
						<div className="LinkItem">
							<i className="fas fa-bars"></i>
							<span>Products</span>
						</div>
						<div className="LinkItem">
							<i className="fas fa-question"></i>
							<span>Help</span>
						</div>
						<div className="LinkItem">
							<i className="fas fa-phone"></i>
							<span>Consultation</span>
						</div>
						<div className="LinkItem">
							<i className="fas fa-user"></i>
							<span>Account</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
