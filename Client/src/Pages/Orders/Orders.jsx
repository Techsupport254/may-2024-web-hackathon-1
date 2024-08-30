import React, {
	useContext,
	useState,
	useMemo,
	useEffect,
	useCallback,
} from "react";
import { Table, Tag, Space, Button } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
import "./Orders.css";
import { orderCategory } from "../../Data";
import { ApiContext } from "../../Context/ApiProvider";
import axios from "axios";
import { useHistory } from "react-router-use-history";

const Orders = () => {
	const { userData, orderData } = useContext(ApiContext);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [productsDetails, setProductsDetails] = useState({});
	const [expandedKeys, setExpandedKeys] = useState([]);
	const history = useHistory();

	const filteredOrders = useMemo(() => {
		if (selectedCategory === "All") {
			return orderData;
		} else {
			return orderData?.filter((order) => {
				const latestTimeline = order?.timeline[order.timeline.length - 1];
				return latestTimeline?.type === selectedCategory;
			});
		}
	}, [orderData, selectedCategory]);

	const fetchProductDetails = useCallback(
		async (productId) => {
			if (!productsDetails[productId]) {
				try {
					const response = await axios.get(
						`http://localhost:8000/products/${productId}`
					);
					setProductsDetails((prevDetails) => ({
						...prevDetails,
						[productId]: response.data,
					}));
				} catch (error) {
					console.error("Error fetching product details:", error);
				}
			}
		},
		[productsDetails]
	);

	useEffect(() => {
		if (filteredOrders) {
			filteredOrders.forEach((order) => {
				order.products.forEach((product) => {
					fetchProductDetails(product.productId);
				});
			});
		}
	}, [filteredOrders, fetchProductDetails]);

	const handleRowClick = (record) => {
		const newExpandedKeys = [...expandedKeys];
		const index = newExpandedKeys.indexOf(record._id);
		if (index > -1) {
			newExpandedKeys.splice(index, 1);
		} else {
			newExpandedKeys.push(record._id);
		}
		setExpandedKeys(newExpandedKeys);
	};

	const columns = [
		{
			title: "Order ID",
			dataIndex: "orderId",
			key: "orderId",
			render: (text, record) => (
				<a
					style={{ color: "var(--success-dark)" }}
					onClick={() => history.push(`/order/${record.orderId}`)}
				>
					{text}
				</a>
			),
		},
		{
			title: "Images",
			dataIndex: "products",
			key: "images",
			render: (products) => (
				<div className="image-container">
					{products.slice(0, 3).map((product, index) => {
						const productDetails = productsDetails[product.productId];
						return (
							<img
								key={product.productId}
								src={productDetails?.images?.[0] || "https://picsum.photos/200"}
								alt={productDetails?.productName || product.title}
								className="circular-image"
								style={{ zIndex: 10 - index }}
							/>
						);
					})}
					{products.length > 3 && (
						<div className="more-images">+{products.length - 3}</div>
					)}
				</div>
			),
		},
		{
			title: "Status",
			dataIndex: "timeline",
			key: "status",
			render: (timeline) => {
				const latestTimeline = timeline[timeline.length - 1];
				return (
					<Tag
						color={
							latestTimeline.type === "Confirmed"
								? "var(--info-dark)"
								: latestTimeline.type === "Delivered"
								? "var(--success-dark)"
								: latestTimeline.type === "Out for Delivery"
								? "var(--primary-dark)"
								: latestTimeline.type === "Pending"
								? "var(--warning-dark)"
								: "var(--gray)"
						}
					>
						{latestTimeline.type}
					</Tag>
				);
			},
		},
		{
			title: "Order Date",
			dataIndex: "createdAt",
			key: "orderDate",
			render: (date) =>
				date
					? new Date(date).toLocaleDateString("en-GB", {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
					  })
					: "Invalid Date",
		},
		{
			title: "Delivery Date",
			dataIndex: "deliveryDate",
			key: "deliveryDate",
			render: (date, record) =>
				record.status === "Delivered" && date
					? new Date(date).toLocaleDateString()
					: "Pending Delivery",
		},
		{
			title: "Amount",
			dataIndex: "amounts",
			key: "amount",
			render: (amounts) =>
				`ksh. ${amounts.totalAmount
					.toFixed(2)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
		},
	];

	const expandedRowRender = (order) => {
		const productColumns = [
			{
				title: "Product Name",
				dataIndex: "productName",
				key: "productName",
				render: (text, product) => {
					const productDetails = productsDetails[product.productId];
					return productDetails?.productName || text;
				},
			},
			{
				title: "Image",
				dataIndex: "image",
				key: "image",
				render: (text, product) => {
					const productDetails = productsDetails[product.productId];
					return (
						<img
							src={productDetails?.images?.[0] || "https://picsum.photos/200"}
							alt={productDetails?.productName || product.title}
							style={{ width: 50, height: 50, borderRadius: "5px" }}
						/>
					);
				},
			},
			{
				title: "Price",
				dataIndex: "price",
				key: "price",
				render: (text, product) => {
					const productDetails = productsDetails[product.productId];
					return `ksh. ${productDetails?.price || text}`;
				},
			},
			{
				title: "Quantity",
				dataIndex: "quantity",
				key: "quantity",
			},
		];

		return (
			<Table
				columns={productColumns}
				dataSource={order.products}
				pagination={false}
				rowKey="productId"
			/>
		);
	};

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
							<span
								style={{
									color:
										item.title === "Delivered"
											? "var(--success-dark)"
											: item.title === "Out for Delivery"
											? "var(--warning-dark)"
											: item.title === "Confirmed"
											? "var(--info-dark)"
											: "var(--gray)",
								}}
							>
								{item.title}
							</span>
						</div>
					))}
				</div>
				<Table
					columns={columns}
					expandable={{
						expandedRowRender,
						rowExpandable: () => true,
						expandedRowKeys: expandedKeys,
						onExpand: (expanded, record) => {
							handleRowClick(record);
						},
					}}
					dataSource={filteredOrders}
					rowKey="_id"
					onRow={(record) => ({
						onClick: () => handleRowClick(record),
					})}
				/>
			</div>
		</div>
	);
};

export default Orders;
