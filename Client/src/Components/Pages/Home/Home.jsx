import React from "react";
import "./Home.css";
import Products from "../../Products/Products";
import axios from "axios";
import Landing from "../../Landing/Landing";
import Banner from "../../Banner/Banner";
import BestSales from "../../BestSales/BestSales";
import Discount from "../../Discount/Discount";
import Popular from "../../Popular/Popular";

const Home = ({ products, userData }) => {
	// filter 3rd and 4th products
	const advertProducts = products.filter(
		(product, index) => index === 3 || index === 4
	);

	return (
		<div className="Home">
			<div className="Landing">
				<Landing product={products[3]} userData={userData} />
			</div>
			<div className="Banner">
				<div className="Header">
					<h3>Featured Products</h3>
				</div>
				<Banner products={products} userData={userData} />
			</div>
			<div className="Adverts">
				<div className="Header">
					<h3>Best Sales</h3>
				</div>
				<BestSales products={advertProducts} userData={userData} />
			</div>
			<div className="Products">
				<div className="Header">
					<h3>Latest Products</h3>
					<span>
						View All <i className="fas fa-arrow-right"></i>
					</span>
				</div>
				<Products products={products} userData={userData} />
			</div>
			<div className="Discount">
				<div className="Header">
					<h3>Discounted Products</h3>
				</div>
				<Discount product={products[1]} userData={userData} />
			</div>
			<div className="Popular">
				<div className="Header">
					<h3>Popular Products</h3>
				</div>
				<Popular products={products} userData={userData} />
			</div>
		</div>
	);
};

export default Home;
