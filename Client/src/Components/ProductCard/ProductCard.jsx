import React, { useState } from "react";
import "./ProductCard.css";
import Skeleton from "../Skeleton/Skeleton";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductCard = ({ product, isLoading, onProductClick, userData }) => {
	const [adding, setAdding] = useState(false);
	const [added, setAdded] = useState(false);

	const handleToCart = async () => {
		setAdding(true);
		try {
			const response = await axios.post(
				"http://localhost:8000/cart",
				{
					userId: userData?._id,
					productId: product?._id,
					quantity: 1,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			console.log(response);
			if (response.status === 200) {
				setAdding(false);
				setAdded(true);
			}
		} catch (error) {
			console.log(error);
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
		// Show skeleton loading effect
		return <Skeleton />;
	}

	return (
		<Link to={`/product/${product?._id}`}
			className="Product-Card"
		>
			<div
				className="ProductContent"
				onClick={() => onProductClick(product?._id)}
			>
				<img src={product?.images[0]} alt={product?.productName} />
				<h3>{product?.productName}</h3>
				<p>KSh.{product?.price}</p>
				<p>{product.stock} in stock</p>
			</div>
			<div className="Ratings">
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star"></i>
				<i className="fas fa-star-half-alt"></i>
				<i className="far fa-star"></i>
			</div>
			<div className="ProductButtons">
				<button className="ProductButton" onClick={handleToCart}>
					{renderActionButton()}
				</button>
				<button className="ProductButton">
					Buy Now <i className="fas fa-arrow-right"></i>
				</button>
			</div>
		</Link>
	);
};

export default ProductCard;
