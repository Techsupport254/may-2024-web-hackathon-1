import React from "react";
import "./Home.css";
import Banner from "../../Banner/Banner";
import Products from "../../Products/Products";

const Home = () => {
	return (
		<div className="Home">
			<div className="Banner">
				<Banner />
			</div>
			<div className="Products">
				<Products />
			</div>
		</div>
	);
};

export default Home;
