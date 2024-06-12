import { Button } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { ApiContext } from "../../Context/ApiProvider";

const ProductDetails = ({ product, tags, cartItems, id }) => {
	const { userData } = useContext(ApiContext);
	const [adding, setAdding] = useState(false);
	const [isInCart, setIsInCart] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Checks if the product is already in the cart upon component mount or update
		setIsInCart(cartItems?.products?.some((item) => item.productId === id));
	}, [cartItems, id]);

	const handleToCart = async (e) => {
		e.preventDefault();
		setAdding(true);
		try {
			if (!userData?._id) {
				throw new Error("User ID is not available");
			}
			if (!product?._id) {
				throw new Error("Product ID is not available");
			}
			const payload = {
				userId: userData._id,
				products: [
					{
						productId: product._id,
						productName: product.productName,
						price: product.price,
						quantity: 1,
					},
				],
			};
			console.log("Payload for adding to cart:", payload);
			const response = await axios.post("http://localhost:8000/cart", payload, {
				headers: { "Content-Type": "application/json" },
			});
			console.log("Response from adding to cart:", response);
			if (response.status === 200) {
				setIsInCart(true);
				return true; // Return true to indicate successful addition
			}
		} catch (error) {
			console.error(
				"Error adding to cart:",
				error.response?.data || error.message
			);
			setError(
				error.response?.data?.message ||
					"An error occurred while adding to cart."
			);
		} finally {
			setAdding(false);
		}
		return false; // Return false to indicate failed addition
	};

	const buyNow = async (e) => {
		e.preventDefault();
		if (!isInCart) {
			const added = await handleToCart(e);
			if (added) {
				window.location.href = "/cart";
			}
		} else {
			window.location.href = "/cart";
		}
	};

	return (
		<div className="ProductDetails">
			<h3 className="ProductName">{product?.productName}</h3>
			<p>
				<b>Product Category:</b> {product?.productCategory},{" "}
				{product?.subCategory}
			</p>
			<p>
				<b>Brand:</b> {product?.brandName}
			</p>
			<p className="Stock">{product?.stock} Available</p>
			<p>
				<b>Weight:</b> {product?.productWeight}
			</p>
			<p>
				<b>Packaging Type:</b> {product?.packagingType}
			</p>
			<p>
				<b>Labels:</b> {product?.labels}
			</p>
			<div className="ProductDescription">
				<h3>Product Description</h3>
				<p>{product?.productDescription}</p>
			</div>
			<div className="Tags">
				<i className="fas fa-tags"></i>
				{tags.map((tag, index) => (
					<span key={index}>{tag}</span>
				))}
			</div>
			<div className="PriceTag">
				<span>
					KES. {product?.price}
					<small
						style={{
							textDecoration: product?.wholesalePrice ? "none" : "line-through",
						}}
						onMouseEnter={(e) => {
							e.target.innerText = `KES. ${product?.wholesalePrice}`;
							e.target.style.cursor = "pointer";
							e.target.title = `${product?.wholesaleRate} units for wholesale to apply`;
						}}
					>
						KES. {product?.wholesalePrice}
					</small>
				</span>
			</div>
			<div className="ProductBtns">
				{isInCart ? (
					<Button
						variant="contained"
						onClick={(e) => {
							e.preventDefault();
							window.location.href = "/cart";
						}}
						style={{
							backgroundColor: "var(--bg-color)",
						}}
					>
						Proceed to Buy
					</Button>
				) : (
					<>
						<Button
							variant="contained"
							onClick={buyNow}
							disabled={adding}
							style={{
								backgroundColor: "var(--bg-color)",
							}}
						>
							{adding ? "Adding..." : "Buy Now"}
						</Button>
						<Button
							variant="outlined"
							onClick={handleToCart}
							disabled={adding}
							size="large"
							style={{
								border: "solid var(--bg-color)",
								color: "var(--bg-color)",
							}}
						>
							{adding ? "Adding..." : "Add to Cart"}
						</Button>
					</>
				)}
			</div>
			{error && <p className="ErrorMessage">{error}</p>}
		</div>
	);
};

export default ProductDetails;

// Validate props
ProductDetails.propTypes = {
	product: PropTypes.object.isRequired,
	tags: PropTypes.array.isRequired,
	cartItems: PropTypes.object.isRequired,
	id: PropTypes.string.isRequired,
};
