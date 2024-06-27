import { useState, useContext } from "react";
import "./BannerCard.css";
import Skeleton from "../Skeleton/Skeleton";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ApiContext } from "../../Context/ApiProvider";

const BannerCard = ({ product, isLoading, onProductClick }) => {
	const { userData } = useContext(ApiContext);
	const [adding, setAdding] = useState(false);
	const [added, setAdded] = useState(false);
	const [error, setError] = useState(null);

	const handleToCart = async (e) => {
		e.stopPropagation(); // Prevent link navigation when clicking the button
		setAdding(true);
		try {
			const response = await axios.post(
				"https://agrisolve.vercel.app/cart",
				{
					userId: userData?._id,
					products: [
						{
							productId: product?._id,
							productName: product?.productName,
							price: product?.price,
							quantity: 1,
						},
					],
				},
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			if (response.status === 200) {
				setAdded(true);
				return true; // Indicates successful addition
			}
		} catch (error) {
			setError(
				error.response?.data?.message ||
					"An error occurred while adding to cart."
			);
		} finally {
			setAdding(false);
		}
		return false; // Indicates failure
	};

	const buyNow = async (e) => {
		e.stopPropagation(); // Prevent link navigation when clicking the button
		if (!added) {
			const addedSuccessfully = await handleToCart(e);
			if (addedSuccessfully) {
				window.location.href = "/cart"; // Redirect to cart page
			}
		} else {
			window.location.href = "/cart"; // Redirect to cart if already added
		}
	};

	const renderActionButton = () => {
		if (adding) {
			return <i className="fas fa-spinner fa-spin"></i>;
		} else if (added) {
			return (
				<>
					<i className="fas fa-check"></i> In Cart
				</>
			);
		} else {
			return (
				<>
					<i className="fas fa-shopping-cart"></i> Add to Cart
				</>
			);
		}
	};

	if (isLoading) {
		return <Skeleton />;
	}
	return (
		<div className="BannerCardContainer">
			<Link
				to={`/product/${product?._id}`}
				onClick={(e) => {
					if (!e.target.classList.contains("ProductButton")) {
						onProductClick(product?._id);
					}
				}}
				className="BannerCardContent"
			>
				<div className="BannerCardImage">
					<img src={product?.images[0]} alt={product?.productName} />
				</div>
				<div className="BannerCardDetails">
					<h3>{product?.productName}</h3>
					<p>KSh.{product?.price}</p>
					<p>{product.stock} in stock</p>
					<div className="Ratings">
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star"></i>
						<i className="fas fa-star-half-alt"></i>
						<i className="far fa-star"></i>
					</div>
				</div>
			</Link>
			<div className="BannerButtons">
				<button
					className="ProductButton"
					onClick={handleToCart}
					disabled={adding}
				>
					{renderActionButton()}
				</button>
				<button className="ProductButton" onClick={buyNow}>
					Buy Now <i className="fas fa-arrow-right"></i>
				</button>
			</div>
			{error && <p className="ErrorMessage">{error}</p>}
		</div>
	);
};

export default BannerCard;

BannerCard.propTypes = {
	product: PropTypes.object.isRequired,
	isLoading: PropTypes.bool,
	onProductClick: PropTypes.func,
};
