import React from "react";
import "./Orders.css";
import { orderCategory } from "../../Data";
import axios from "axios";

const Orders = () => {
	const [selectedCategory, setSelectedCategory] = React.useState("All");

	const orders = [
		{
			id: 1,
			title: "Order 1",
			products: [
				{
					id: 1,
					title: "Product 1",
					price: 1000,
					quantity: 2,
					image: "https://picsum.photos/200",
				},
				{
					id: 2,
					title: "Product 2",
					price: 1000,
					quantity: 2,
					image: "https://picsum.photos/200",
				},
			],
			orderDate: "12/12/2020",
			deliveryDate: "12/12/2020",
			amount: 1000,
			status: "Delivered",
		},
		{
			id: 2,
			title: "Order 2",
			products: [
				{
					id: 1,
					title: "Product 1",
					price: 1000,
					quantity: 2,
					image: "https://picsum.photos/200",
				},
			],
			orderDate: "12/12/2020",
			deliveryDate: "12/12/2020",
			amount: 1000,
			status: "Pending",
		},
		{
			id: 3,
			title: "Order 3",
			products: [
				{
					id: 1,
					title: "Product 1",
					price: 1000,
					quantity: 2,
					image: "https://picsum.photos/200",
				},
			],
			orderDate: "12/12/2020",
			deliveryDate: "12/12/2020",
			amount: 1000,
			status: "Cancelled",
		},
	];

	const filteredOrders = React.useMemo(() => {
		if (selectedCategory === "All") {
			return orders;
		} else {
			return orders.filter((order) => order.status === selectedCategory);
		}
	}, [orders, selectedCategory]);

	return (
		<div className="Orders">
			<div className="OrdersContainer">
				<div className="OrderItems">
					{orderCategory.map((item, index) => (
						<div
							className={`OrdersItem ${
								selectedCategory === item.title ? "active" : ""
							} ${item.title}`}
							key={index}
							onClick={() => setSelectedCategory(item.title)}
						>
							{item.title}
						</div>
					))}
				</div>
				{filteredOrders.length === 0 && (
					<div className="NoOrders">No orders found</div>
				)}
				<div className="OrderList">
					{filteredOrders.map((order) => (
						<div className="Order" key={order.id}>
							<div className="OrderTop">
								<div
									style={{ display: "flex", alignItems: "center", gap: "5px" }}
								>
									Order
									<h3>{order.id}</h3>
								</div>
								<span
									className={`Status ${
										order.status === "Delivered"
											? "Delivered"
											: order.status === "Pending"
											? "Pending"
											: "Cancelled"
									}`}
								>
									{order.status}
								</span>
								<p>Ordered: {order.orderDate}</p>
								{order.status === "Delivered" && (
									<p>Delivered: {order.deliveryDate}</p>
								)}
								{order.status === "Pending" && (
									<p>Expected: {order.deliveryDate}</p>
								)}
								{order.status === "Cancelled" && (
									<p>Cancelled: {order.deliveryDate}</p>
								)}
								<p>Amount: ksh. {order.amount}</p>
							</div>
							<div className="ProductList">
								{order.products.map((product) => (
									<div className="Product" key={product.id}>
										<img src={product.image} alt={product.title} />
										<div>
											<p>{product.title}</p>
											<p>Price: ${product.price}</p>
											<p>Quantity: {product.quantity}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Orders;
