import React, { useState } from "react";
import "./ProductCard.css";
import Skeleton from "../Skeleton/Skeleton";

const ProductCard = ({ product, isLoading, onProductClick }) => {
	const [adding, setAdding] = useState(false);
	const [added, setAdded] = useState(false);

	const handleToCart = () => {
		// Add to cart local storage
		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		const newProduct = {
			id: product?._id,
			name: product.productName,
			price: product?.price,
			image: product?.images[0],
			brand: product?.brandName,
			category: product?.productCategory,
			quantity: 1,
		};

		const existingProductIndex = cart.findIndex(
			(item) => item.id === product?._id
		);

		if (existingProductIndex !== -1) {
			cart[existingProductIndex].quantity += 1;
		} else {
			cart.push(newProduct);
		}

		localStorage.setItem("cart", JSON.stringify(cart));

		// Show success message
		setAdding(true);
		setTimeout(() => {
			setAdded(true);
			setAdding(false);
		}, 2000);
	};

	if (isLoading) {
		// Show skeleton loading effect
		return <Skeleton />;
	}

	return (
		<div className="Product-Card">
			<div
				className="ProductContent"
				onClick={() => onProductClick(product?._id)} // Compare with '_id'
			>
				<img src={product?.images[0]} alt={product?.productName} />
				<h3>{product?.productName}</h3>
				<p>KSh.{product?.price}</p>
				<p>{product.stock}</p>
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
					{adding ? (
						<i className="fas fa-spinner fa-spin"></i>
					) : added ? (
						<>
							<i className="fas fa-check"></i> In Cart
						</>
					) : (
						<>
							<i className="fas fa-shopping-cart"></i> Add to Cart
						</>
					)}
				</button>
				<button className="ProductButton">
					Buy Now <i className="fas fa-arrow-right"></i>
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
