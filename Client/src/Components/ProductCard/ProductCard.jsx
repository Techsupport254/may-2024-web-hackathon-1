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
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			brand : product.brand,
			category : product.category,
			quantity: 1,
		};

		const existingProductIndex = cart.findIndex(
			(item) => item.id === product.id
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
		<div className="ProductCard">
			<div
				className="ProductContent"
				onClick={() => onProductClick(product.id)}
			>
				<img src={product.image} alt={product.name} />
				<h3>{product.name}</h3>
				<p>Price: KSh.{product.price}</p>
				<p>Availability: {product.available}</p>
				<div className="Desc">
					<p>{product.description}</p>
				</div>
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
