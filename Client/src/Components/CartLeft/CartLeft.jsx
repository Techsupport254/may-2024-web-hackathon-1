import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Badge } from "antd";
import "./CartLeft.css";
import { Input } from "@mui/material";

const CartLeft = ({ cartItems, userData, setCartItems }) => {
	const [error, setError] = useState(null);

	const handleAddToCart = async (productId, quantity) => {
		try {
			const response = await axios.post(
				"http://localhost:8000/cart",
				{
					userId: userData?._id,
					productId: productId,
					quantity: quantity,
				},
				{
					headers: { "Content-Type": "application/json" },
				}
			);
			if (response.status === 200) {
				window.location.reload(); // Reload the page
			}
		} catch (error) {
			setError(
				error.response?.data.message ||
					"An error occurred while adding to cart."
			);
		}
	};

	const handleRemoveItem = async (productId) => {
		try {
			// Optimistically remove the item from the cart locally
			setCartItems((prevCartItems) =>
				prevCartItems.filter((item) => item._id !== productId)
			);

			// Send a DELETE request to remove the item from the server
			await axios.delete(
				`http://localhost:8000/cart/${userData?._id}/${productId}`,
				{
					headers: { "Content-Type": "application/json" },
				}
			);

			// Reload the page
			window.location.reload();
		} catch (error) {
			// Rollback the local changes if an error occurs
			setCartItems((prevCartItems) => [...prevCartItems]); // Reset to previous state
			setError(
				error.response?.data.message ||
					"An error occurred while removing from cart."
			);
		}
	};

	const handleQuantityChange = async (productId, newQuantity) => {
		if (newQuantity < 1) return; // Prevent setting negative quantities
		try {
			// Optimistically update the quantity locally
			setCartItems((prevCartItems) =>
				prevCartItems?.map((item) =>
					item._id === productId ? { ...item, quantity: newQuantity } : item
				)
			);

			// Send a PATCH request to update the quantity on the server
			await axios.patch(
				`http://localhost:8000/cart/${userData?._id}/${productId}`,
				{ quantity: newQuantity },
				{
					headers: { "Content-Type": "application/json" },
				}
			);

			// Reload the page
			window.location.reload();
		} catch (error) {
			// Rollback the local changes if an error occurs
			setCartItems((prevCartItems) => [...prevCartItems]); // Reset to previous state
			setError(
				error.response?.data.message ||
					"An error occurred while updating quantity."
			);
		}
	};

	return (
		<div className="CartLeft">
			<h2 className="CartTitle">
				Your Cart <span style={{ color: "green" }}>{cartItems?.length}</span>{" "}
				Items
			</h2>
			<div className="CartItems">
				{cartItems?.length === 0 ? (
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
					cartItems?.map((item) => (
						<div className="CartItem" key={item._id}>
							<img
								src={item.images[0]}
								alt={item.productName}
								className="CartItemImg"
							/>
							<div className="CartItemDetails">
								<div className="CartInfo">
									<div className="CartItemTitle">
										<h3>{item.productName}</h3>
									</div>
									<span className="CartItemPrice">
										KSh.{(item.price * item.quantity).toFixed(2)} ( KSh.
										{item.price} each, {item.quantity}pcs)
									</span>
									<div className="Brand">
										<span>Brand: </span>
										<p>{item.productName}</p>
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
										onClick={() =>
											handleQuantityChange(item._id, item.quantity - 1)
										}
									>
										-
									</button>
									<Input
										variant="outlined"
										type="number"
										value={item.quantity}
										onChange={(e) =>
											handleQuantityChange(item._id, e.target.value)
										}
										className="QuantityInput"
										size="small"
										name="quantity"
										id="quantity"
									/>
									<button
										className="QuantityBtn"
										onClick={() =>
											handleQuantityChange(item._id, item.quantity + 1)
										}
									>
										+
									</button>
								</div>
								<button
									className="RemoveCartItemBtn"
									onClick={() => handleRemoveItem(item._id)}
								>
									<i className="fas fa-trash"></i>
								</button>
							</div>
						</div>
					))
				)}
			</div>
			{error && <div className="error">{error}</div>}
		</div>
	);
};

CartLeft.propTypes = {
	cartItems: PropTypes.array.isRequired,
	userData: PropTypes.object.isRequired,
	setCartItems: PropTypes.func.isRequired, // Modified prop type name
};

export default CartLeft;
