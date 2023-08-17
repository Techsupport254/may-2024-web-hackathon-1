import React from "react";
import "./Home.css";
import Products from "../../Products/Products";
import axios from "axios";
import Landing from "../../Landing/Landing";
import Banner from "../../Banner/Banner";
import BestSales from "../../BestSales/BestSales";
import Discount from "../../Discount/Discount";
import Popular from "../../Popular/Popular";

const Home = () => {
	const [products, setProducts] = React.useState([]);
	// fetch products from database
	React.useEffect(() => {
		axios
			.get("https://agrisolve-techsupport254.vercel.app/products")
			.then((res) => {
				setProducts(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// filter 3rd and 4th products
	const advertProducts = products.filter(
		(product, index) => index === 3 || index === 4
	);

	return (
		<div className="Home">
			<div className="Landing">
				<Landing product={products[3]} />
			</div>
			<div className="Banner">
				<div className="Header">
					<h3>Featured Products</h3>
				</div>
				<Banner products={products} />
			</div>
			<div className="Adverts">
				<div className="Header">
					<h3>Best Sales</h3>
				</div>
				<BestSales products={advertProducts} />
			</div>
			<div className="Products">
				<div className="Header">
					<h3>Latest Products</h3>
					<span>
						View All <i className="fas fa-arrow-right"></i>
					</span>
				</div>
				<Products products={products} />
			</div>
			<div className="Discount">
				<div className="Header">
					<h3>Discounted Products</h3>
				</div>
				<Discount product={products[3]} />
			</div>
			<div className="Popular">
				<div className="Header">
					<h3>Popular Products</h3>
				</div>
				<Popular products={products} />
			</div>
		</div>
	);
};

export default Home;
