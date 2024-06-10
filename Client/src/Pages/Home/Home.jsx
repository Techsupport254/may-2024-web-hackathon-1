import { useContext } from "react";
import PropTypes from "prop-types";
import "./Home.css";
import Products from "../../Pages/Products/Products";
import Landing from "../../Components/Landing/Landing";
import Banner from "../../Components/Banner/Banner";
import BestSales from "../../Components/BestSales/BestSales";
import Discount from "../../Components/Discount/Discount";
import Popular from "../../Components/Popular/Popular";
import ShopByCategories from "../../Components/ShopByCategories/ShopByCategories";
import { Button, TextField } from "@mui/material";
import deliveryImg from "../../assets/delivery.png";
import noProductImage from "../../assets/nochat.png";
import subscribeImg from "../../assets/subscribe.png";
import { ApiContext } from "../../Context/ApiProvider";

const Home = () => {
	const { products, userData, isLoading } = useContext(ApiContext);
	const advertProducts = products.slice(3, 5);

	const renderProductsSection = (title, products) => (
		<div className="Products FlexDisplay">
			<div className="Header">
				<h3>{title}</h3>
				<span>
					View All <i className="fas fa-arrow-right"></i>
				</span>
			</div>
			{products.length > 0 ? (
				<Products products={products} userData={userData} />
			) : (
				<div className="NoProduct FlexDisplay">
					<img src={noProductImage} alt="no product" />
					<h3>No Products for this category</h3>
				</div>
			)}
		</div>
	);

	const renderSectionHeader = (title) => (
		<div className="Header">
			<h3>{title}</h3>
		</div>
	);

	return (
		<div className="Home FlexDisplay">
			<div className="Landing FlexDisplay">
				<Landing
					product={products[3]}
					userData={userData}
					isLoading={isLoading}
				/>
			</div>
			<div className="Banner FlexDisplay">
				<Banner products={products} userData={userData} />
			</div>
			<ShopByCategories products={products} userData={userData} />
			<div className="Adverts FlexDisplay">
				{renderSectionHeader("Best Sales")}
				{advertProducts.length > 0 ? (
					<BestSales products={advertProducts} userData={userData} />
				) : (
					<div className="NoProduct FlexDisplay">
						<img src={noProductImage} alt="no product" />
						<h3>No Products for this category</h3>
					</div>
				)}
			</div>
			{renderProductsSection("Latest Products", products)}
			{renderProductsSection("Recently Viewed", products)}
			<div className="Delivery FlexDisplay">
				<div className="DeliveryContainer FlexDisplay">
					<div className="DeliveryLeft FlexDisplay">
						<small>Discover Agrisolve</small>
						<span>AGRISOLVE DELIVERS TO YOU</span>
						<p>
							Agrisolve delivers to you in 24 hours.
							<br />
							We deliver to you in 24 hours.
						</p>
						<Button
							variant="outlined"
							onClick={() => {
								window.location.href = "/products";
							}}
							style={{
								color: "var(--bg-color)",
								borderColor: "var(--bg-color)",
							}}
						>
							Shop Now
						</Button>
					</div>
					<div className="DeliveryRight FlexDisplay">
						<img src={deliveryImg} alt="delivery" />
					</div>
				</div>
			</div>
			{renderProductsSection("Agrisolve Top Sales", products)}
			<div className="Discount FlexDisplay">
				{renderSectionHeader("Discounted Products")}
				{products.length > 0 ? (
					<Discount product={products[1]} userData={userData} />
				) : (
					<div className="NoProduct">
						<img src={noProductImage} alt="no product" />
						<h3>No Products for this category</h3>
					</div>
				)}
			</div>
			<div className="Popular FlexDisplay">
				{renderSectionHeader("Popular Products")}
				{products.length > 0 ? (
					<Popular products={products} userData={userData} />
				) : (
					<div className="NoProduct">
						<img src={noProductImage} alt="no product" />
						<h3>No Products for this category</h3>
					</div>
				)}
			</div>
			<div className="SubscribeNews FlexDisplay">
				<div className="SubscribeNewsContainer FlexDisplay">
					<div className="DeliveryLeft FlexDisplay">
						<small>Discover Agrisolve</small>
						<span>SUBSCRIBE TO THE NEWS</span>
						<p>
							Be aware of all our discounts and offers!
							<br />
							Subscribe to our newsletter to get all the latest updates.
						</p>
						<TextField
							id="outlined"
							label="Subscribe to our newsletter"
							variant="outlined"
							size="small"
							color="success"
							style={{ width: "100%", color: "white" }}
							InputProps={{
								endAdornment: (
									<i
										className="fas fa-paper-plane"
										style={{
											color: "var(--bg-color)",
										}}
									></i>
								),
							}}
						/>
					</div>
					<div className="DeliveryRight FlexDisplay">
						<img src={subscribeImg} alt="delivery" />
					</div>
				</div>
			</div>
		</div>
	);
};

Home.propTypes = {
	products: PropTypes.array.isRequired,
	userData: PropTypes.object.isRequired,
	isLoading: PropTypes.bool.isRequired,
};

export default Home;
