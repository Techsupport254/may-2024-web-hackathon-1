import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Link,
	Box,
} from "@mui/material";
import {
	CheckCircle as CheckCircleIcon,
	LocalShipping as LocalShippingIcon,
	AccessTime as AccessTimeIcon,
	Pending as PendingIcon,
} from "@mui/icons-material";
import "./Order.css";

const Order = () => {
	const { id } = useParams();
	const [orderDetails, setOrderDetails] = useState(null);

	useEffect(() => {
		const fetchOrderDetails = async (id) => {
			try {
				const response = await axios.get(`http://localhost:8000/order/${id}`);
				const productsWithDetails = await Promise.all(
					response.data.products.map(async (product) => {
						const productDetails = await fetchProductDetails(product.productId);
						return { ...product, ...productDetails };
					})
				);
				setOrderDetails({ ...response.data, products: productsWithDetails });
			} catch (error) {
				console.error("Error fetching order details:", error);
			}
		};

		if (id) {
			fetchOrderDetails(id);
		}
	}, [id]);

	const fetchProductDetails = async (productId) => {
		try {
			const response = await axios.get(
				`http://localhost:8000/products/${productId}`
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching product details:", error);
		}
	};

	const columns = [
		{
			title: "#",
			dataIndex: "key",
			key: "key",
		},
		{
			title: "Product Name",
			dataIndex: "productName",
			key: "productName",
		},
		{
			title: "Images",
			dataIndex: "images",
			key: "images",
			render: (images) => (
				<div className="image-container">
					{images.slice(0, 3).map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Product image ${index + 1}`}
							className="circular-image"
							style={{ zIndex: 10 - index }}
						/>
					))}
					{images.length > 3 && (
						<div className="more-images">+{images.length - 3}</div>
					)}
				</div>
			),
		},
		{
			title: "Quantity",
			dataIndex: "quantity",
			key: "quantity",
		},
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (text, record) =>
				`KSh. ${(record.price * record.quantity)
					.toFixed(2)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
		},
	];

	const dataSource = orderDetails?.products?.map((product, index) => ({
		key: index + 1,
		productName: product.productName,
		quantity: product.quantity,
		price: product.price,
		images: product.images || [],
	}));

	const allStates = [
		{
			type: "Delivered",
			date: null,
			dotColor: "success.main",
			dotIcon: <AccessTimeIcon />,
		},
		{
			type: "Out for Delivery",
			date: null,
			dotColor: "secondary.main",
			dotIcon: <LocalShippingIcon />,
		},
		{
			type: "Confirmed",
			date: null,
			dotColor: "primary.main",
			dotIcon: <CheckCircleIcon />,
		},
		{
			type: "Pending",
			date: null,
			dotColor: "warning.main",
			dotIcon: <PendingIcon />,
			displayText: "Default before payment",
		},
	];

	const timelineEvents = orderDetails?.timeline || [];

	// Determine if Delivered state is present
	const isDelivered = timelineEvents.some((event) =>
		event.type.includes("Delivered")
	);

	// Set dates for allStates based on timelineEvents
	timelineEvents.forEach((event) => {
		const state = allStates.find((state) => event.type.includes(state.type));
		if (state) {
			state.date = event.date
				? new Date(event.date).toLocaleString(undefined, {
						day: "numeric",
						month: "long",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
				  })
				: "N/A";
		}
	});

	allStates.forEach((state, index) => {
		if (!state.date) {
			state.date = "N/A";
		}
	});

	const timelineItems = allStates.map((state, index) => {
		const displayText = state.type;
		const icon =
			isDelivered ||
			state.type === "Pending" ||
			timelineEvents.some((event) => event.type.includes(state.type)) ? (
				<CheckCircleIcon />
			) : (
				state.dotIcon
			);

		return (
			<Box
				key={state.type}
				display="flex"
				alignItems="center"
				mb={2}
				className={`timeline-item ${isDelivered ? "completed" : ""}`}
			>
				<Box
					display="flex"
					alignItems="center"
					position="relative"
					className="timeline-item-content"
				>
					<Box
						component="span"
						width={24}
						height={24}
						display="flex"
						alignItems="center"
						justifyContent="center"
						bgcolor={state.dotColor}
						color="white"
						borderRadius="50%"
						zIndex={1}
						className="timeline-dot"
					>
						{icon}
					</Box>
					{index < allStates.length - 1 && (
						<Box className="timeline-line"></Box>
					)}
				</Box>
				<Box className="timeline-item-text">
					<Typography variant="h6" className="timeline-item-title">
						{displayText === "Pending" ? "Order Placed" : displayText}
					</Typography>
					<Typography variant="body2" className="timeline-item-subtitle">
						{state.date}
					</Typography>
				</Box>
			</Box>
		);
	});

	const latestTimelineEntry = orderDetails?.timeline?.length
		? orderDetails.timeline.sort(
				(a, b) => new Date(b.date) - new Date(a.date)
		  )[0]
		: null;

	console.log(orderDetails);

	return (
		<div className="Order">
			<div className="OrderContainer">
				<div className="OrderLeft">
					<div className="Section">
						<h3>Shipping</h3>
						<div className="SectionItem">
							<p>Location</p>
							<p>{orderDetails?.shippingAddress?.street}</p>
						</div>
						<div className="SectionItem">
							<p>Address</p>
							<p>
								{orderDetails?.shippingAddress?.street},{" "}
								{orderDetails?.shippingAddress?.city},{" "}
								{orderDetails?.shippingAddress?.zipCode},{" "}
								{orderDetails?.shippingAddress?.country}
							</p>
						</div>
						<div className="SectionItem">
							<p>Method</p>
							<p>{orderDetails?.shipping?.method}</p>
						</div>
						<div className="SectionItem">
							<p>Tracking Number</p>
							<p>{orderDetails?.shipping?.trackingNumber}</p>
						</div>
					</div>
					<div className="Section">
						<h3>Billing</h3>
						<div className="SectionItem">
							<p>Address</p>
							<p>
								{orderDetails?.billingAddress?.street},{" "}
								{orderDetails?.billingAddress?.city},{" "}
								{orderDetails?.billingAddress?.zipCode},{" "}
								{orderDetails?.billingAddress?.country}
							</p>
						</div>
					</div>
					<div className="Section">
						<h3>Payment Method</h3>
						<div className="SectionItem">
							<p>Method</p>
							<p>{orderDetails?.payment?.method}</p>
						</div>
						<div className="SectionItem">
							<p>Date</p>
							<p>{new Date(orderDetails?.payment?.date).toLocaleString()}</p>
						</div>
						<div className="SectionItem">
							<p>Transaction ID</p>
							<p>{orderDetails?.payment?.transactionId}</p>
						</div>
						<div className="SectionItem">
							<p>Holder</p>
							<p>{orderDetails?.payment?.holder}</p>
						</div>
						<div className="SectionItem">
							<p>Phone</p>
							<p>{orderDetails?.payment?.number}</p>
						</div>
					</div>
					<div className="Section">
						<h3>Order Timeline</h3>
						{timelineItems}
					</div>
				</div>
				<div className="OrderRight">
					<div className="OrderRightTop">
						<div className="OrderTopLeft FlexDisplay">
							<p>Your Order is</p>
							<h3>{latestTimelineEntry?.type}</h3>
							<span>
								as of{" "}
								{latestTimelineEntry &&
									new Date(latestTimelineEntry.date).toLocaleString(undefined, {
										day: "numeric",
										month: "long",
										year: "numeric",
										hour: "numeric",
										minute: "numeric",
									})}
							</span>
						</div>
						<div className="OrderTopRight">
							<p>Order ID: {orderDetails?.orderId}</p>
							<p>
								For Delivery queries, contact us on{" "}
								<Link href="tel:0712345678">0712345678</Link>.
							</p>
						</div>
					</div>
					<div className="OrderRightBottom">
						<TableContainer component={Paper}>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow>
										{columns.map((column) => (
											<TableCell key={column.key}>{column.title}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{dataSource?.map((row) => (
										<TableRow key={row.key}>
											{columns.map((column) => (
												<TableCell key={column.key}>
													{column.render
														? column.render(row[column.dataIndex], row)
														: row[column.dataIndex]}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
						<div className="OrderTotal">
							<h3>Order Summary</h3>
							<div className="OrderSummary">
								<div className="OrderSummaryRow">
									<span className="OrderSummaryLabel">Amount:</span>
									<span className="OrderSummaryValue">
										KSh.{" "}
										{(orderDetails?.amounts.productsAmount ?? 0)
											.toFixed(2)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									</span>
								</div>
								<div className="OrderSummaryRow">
									<span className="OrderSummaryLabel">Tax:</span>
									<span className="OrderSummaryValue">
										KSh.{" "}
										{(orderDetails?.amounts.tax?.amount ?? 0)
											.toFixed(2)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									</span>
								</div>
								<div className="OrderSummaryRow">
									<span className="OrderSummaryLabel">Delivery Fee:</span>
									<span className="OrderSummaryValue">
										KSh.{" "}
										{(orderDetails?.amounts.deliveryFee ?? 0)
											.toFixed(2)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									</span>
								</div>
								<div className="OrderSummaryRow">
									<span className="OrderSummaryLabel">Discount:</span>
									<span className="OrderSummaryValue">
										KSh.{" "}
										{(orderDetails?.amounts?.discounts ?? 0)
											.toFixed(2)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									</span>
								</div>
								<div className="OrderSummaryRow OrderTotalAmount">
									<span className="OrderSummaryLabel">Total:</span>
									<span className="OrderSummaryValue">
										KSh.{" "}
										{(orderDetails?.amounts.totalAmount ?? 0)
											.toFixed(2)
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Order;
