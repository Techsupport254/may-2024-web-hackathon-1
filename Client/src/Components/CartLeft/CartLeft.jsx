import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Badge } from "antd";
import "./CartLeft.css";
import { Input } from "@mui/material";

const CartLeft = ({
	cartItems,
	handleIncreaseQuantity,
	handleDecreaseQuantity,
	handleQuantityChange,
	handleRemoveItem,
	error,
}) => {
	const [detailedCartItems, setDetailedCartItems] = useState([]);

	useEffect(() => {
		const fetchProductDetails = async (productId) => {
			try {
				const response = await fetch(
					`http://localhost:8000/products/${productId}`
				);
				const data = await response.json();
				return data;
			} catch (err) {
				console.log(err);
				return null;
			}
		};

		const getDetailedCartItems = async () => {
			const detailedItems = await Promise.all(
				cartItems.map(async (item) => {
					const productDetails = await fetchProductDetails(item.productId);
					return { ...item, ...productDetails };
				})
			);
			setDetailedCartItems(detailedItems);
		};

		getDetailedCartItems();
	}, [cartItems]);

	const renderCartItem = (item) => (
		<div className="CartItem" key={item.productId}>
			{window.innerWidth > 768 && (
				<img
					src={item.images[0]}
					alt={item.productName}
					className="CartItemImg"
				/>
			)}
			<div className="CartItemDetails">
				<div className="CartInfo">
					{window.innerWidth < 768 && (
						<img
							src={item.images[0]}
							alt={item.productName}
							className="CartItemImg"
						/>
					)}
					<div className="CartItemTitle">
						<h3>{item.productName}</h3>
					</div>
					<span className="CartItemPrice">
						KSh.{(item.price * item.quantity).toFixed(2)} ( KSh.
						{item.price} each, {item.quantity}pcs)
					</span>
					<div className="Brand">
						<span>Brand: </span>
						<p>{item.brandName}</p>
					</div>
					<div className="Categor">
						<span>Category: </span>
						<p>{item.productCategory}</p>
					</div>
				</div>
			</div>

			<div className="CartButtons">
				<div className="QuantityBtns">
					<button
						className="QuantityBtn"
						onClick={() => handleDecreaseQuantity(item.productId)}
					>
						-
					</button>
					<Input
						variant="outlined"
						type="number"
						value={item.quantity}
						onChange={(e) =>
							handleQuantityChange(item.productId, Number(e.target.value))
						}
						className="QuantityInput"
						size="small"
						name="quantity"
						id="quantity"
					/>
					<button
						className="QuantityBtn"
						onClick={() => handleIncreaseQuantity(item.productId)}
					>
						+
					</button>
				</div>
				<button
					className="RemoveCartItemBtn"
					onClick={() => handleRemoveItem(item.productId)}
				>
					<i className="fas fa-trash"></i>
				</button>
			</div>
		</div>
	);

	return (
		<div className="CartLeft">
			<h2 className="CartTitle">
				Your Cart <span style={{ color: "green" }}>{cartItems?.length}</span>{" "}
				Items
			</h2>
			<div className="CartItems">
				{detailedCartItems?.length === 0 ? (
					<div className="EmptyCart">
						<Badge count={0} showZero style={{ backgroundColor: "#52c41a" }}>
							<i
								className="fas fa-shopping-cart"
								style={{ fontSize: "3rem", color: "green" }}
							></i>
						</Badge>
						<h3>Your cart is empty</h3>
						<button
							className="BackToShopBtn"
							onClick={() => (window.location.href = "/")}
						>
							<i className="fas fa-arrow-left"></i>&nbsp; Back to Shop
						</button>
					</div>
				) : (
					detailedCartItems.map((item) => renderCartItem(item))
				)}
			</div>
			{error && <div className="error">{error}</div>}
		</div>
	);
};

CartLeft.propTypes = {
	cartItems: PropTypes.array.isRequired,
	handleIncreaseQuantity: PropTypes.func.isRequired,
	handleDecreaseQuantity: PropTypes.func.isRequired,
	handleQuantityChange: PropTypes.func.isRequired,
	handleRemoveItem: PropTypes.func.isRequired,
	error: PropTypes.string,
};

export default CartLeft;
