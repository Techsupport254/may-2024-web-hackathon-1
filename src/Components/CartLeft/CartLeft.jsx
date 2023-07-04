import React from "react";
import "./CartLeft.css";
import { Badge } from "antd";

const CartLeft = ({
	cartItems,
	handleIncreaseQuantity,
	handleDecreaseQuantity,
	handleRemoveItem,
}) => {
	return (
		<div className="CartLeft">
			<h2 className="CartTitle">
				Your Cart{" "}
				<span style={{ color: "green" }}>
					({cartItems ? cartItems.length : 0})
				</span>{" "}
				Items
			</h2>
			<div className="CartItems">
				{cartItems && cartItems.length === 0 ? (
					<div className="EmptyCart">
						<Badge
							className="CartIcon"
							count={0}
							showZero
							style={{
								size: "larger",
							}}
						>
							<i
								className="fas fa-shopping-cart"
								style={{ fontSize: "3rem", color: "green" }}
							></i>
						</Badge>
						<h3>Your cart is empty</h3>
						{/* Back to products page */}
						<button
							className="BackToShopBtn"
							onClick={() => {
								window.location.href = "/";
							}}
						>
							<i className="fas fa-arrow-left"></i>&nbsp; Back to Shop
						</button>
					</div>
				) : (
					cartItems &&
					cartItems.map((item) => (
						<div className="CartItem" key={item.id}>
							<img src={item.image} alt={item.name} className="CartItemImg" />
							<div className="CartItemDetails">
								<div className="CartInfo">
									<h3 className="CartItemTitle">{item.name}</h3>
									<span className="CartItemPrice">
										KSh.{(item.price * item.quantity).toFixed(2)} ( KSh.
										{item.price} each, {item.quantity}pcs)
									</span>
									<p className="Brand">Brand: {item.brand}</p>
									<p className="Categor">Category: {item.category}</p>
									<p>{item.description}</p>
								</div>
							</div>
							<div className="CartButtons">
								<div className="QuantityBtns">
									<button
										className="QuantityBtn"
										onClick={() => handleIncreaseQuantity(item.id)}
									>
										+
									</button>
									<p className="Quantity">{item.quantity}</p>
									<button
										className="QuantityBtn"
										onClick={() => handleDecreaseQuantity(item.id)}
									>
										-
									</button>
								</div>
								<button
									className="RemoveCartItemBtn"
									onClick={() => handleRemoveItem(item.id)}
								>
									<i className="fas fa-trash"></i>
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default CartLeft;
