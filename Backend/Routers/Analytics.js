const express = require("express");
const router = express.Router();
const Order = require("../Models/OrderModel");
const Product = require("../Models/ProductModel");

// Helper function to calculate averages
const calculateAverages = (orders, isAdmin = false, userId = null) => {
	let totalSales = 0;
	let totalExpenses = 0;
	let totalIncome = 0;
	let totalProducts = 0; // Number of products sold

	for (let order of orders) {
		let orderSales = 0;
		let orderExpenses = 0;
		let orderIncome = 0;

		if (isAdmin) {
			// Admin calculations using the amounts section
			orderSales = order.amounts.productsAmount + order.amounts.deliveryFee;
			orderExpenses = order.amounts.deliveryFee + order.amounts.discounts;
			orderIncome = orderSales - orderExpenses;
			totalProducts += order.products.reduce(
				(sum, product) => sum + product.quantity,
				0
			);
		} else {
			// User calculations using product-specific amounts
			for (let product of order.products) {
				if (!userId || product.refId?.toString() === userId) {
					const productTotalPrice = product.price * product.quantity;
					let productDiscounts = 0;

					// Calculate product-specific discounts
					if (product.productId?.discounts?.length) {
						for (let discount of product.productId.discounts) {
							const orderDate = new Date(order.date);
							if (
								orderDate <= new Date(discount.discountExpiry) &&
								new Date(discount.createdAt) <= orderDate
							) {
								productDiscounts += discount.discountAmount
									? discount.discountAmount * product.quantity
									: 0;
								productDiscounts += discount.discountPercentage
									? (product.price *
											product.quantity *
											discount.discountPercentage) /
									  100
									: 0;
							}
						}
					}

					orderSales += productTotalPrice;
					orderExpenses += productDiscounts;
					orderIncome += productTotalPrice - productDiscounts;
					totalProducts += product.quantity;
				}
			}
		}

		totalSales += orderSales;
		totalExpenses += orderExpenses;
		totalIncome += orderIncome;
	}

	// Calculate averages per product sold
	const averageSales = totalProducts > 0 ? totalSales / totalProducts : 0;
	const averageExpenses = totalProducts > 0 ? totalExpenses / totalProducts : 0;
	const averageIncome = totalProducts > 0 ? totalIncome / totalProducts : 0;

	return {
		totalSales,
		totalExpenses,
		totalIncome,
		totalProducts,
		averageSales,
		averageExpenses,
		averageIncome,
	};
};

// get the products in all orders with their quantities and valid discounts
router.get("/products", async (req, res) => {
	try {
		const allOrders = await Order.find().populate({
			path: "products.productId",
			model: Product,
		});
		if (allOrders.length === 0) {
			return res.status(404).json({ message: "No orders found." });
		}

		const products = allOrders.flatMap((order) =>
			order.products.map((product) => {
				const validDiscounts = product.productId.discounts.filter(
					(discount) => {
						const orderDate = new Date(order.date);
						return (
							orderDate <= new Date(discount.discountExpiry) &&
							new Date(discount.createdAt) <= orderDate
						);
					}
				);

				return {
					productId: product.productId._id,
					productName: product.productName,
					quantity: product.quantity,
					price: product.price,
					orderId: order._id,
					refId: product.refId,
					placed: order.date,
					discounts: validDiscounts,
				};
			})
		);

		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET: Calculate averages and return data in a structured format
router.get("/average/:role/:userId?", async (req, res) => {
	const { role, userId } = req.params;
	try {
		const isAdmin = role === "admin";
		const allOrders = await Order.find().populate({
			path: "products.productId",
			model: Product,
		});

		if (allOrders.length === 0) {
			return res.status(404).json({ message: "No orders found." });
		}

		const allOrdersAverage = calculateAverages(allOrders, isAdmin);
		const filteredOrders = userId
			? allOrders.filter((order) =>
					order.products.some((product) => product.refId?.toString() === userId)
			  )
			: allOrders;

		const userOrdersAverage = calculateAverages(
			filteredOrders,
			isAdmin,
			userId
		);

		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();

		const currentMonthOrders = filteredOrders.filter((order) => {
			const orderDate = new Date(order.date);
			return (
				orderDate.getMonth() === currentMonth &&
				orderDate.getFullYear() === currentYear
			);
		});

		const currentMonthAverage = calculateAverages(
			currentMonthOrders,
			isAdmin,
			userId
		);

		const percentageDifference = (current, overall) =>
			overall !== 0 ? ((current - overall) / overall) * 100 : 0;

		const percentageDifferences = {
			sales: percentageDifference(
				currentMonthAverage.averageSales,
				userOrdersAverage.averageSales
			),
			expenses: percentageDifference(
				currentMonthAverage.averageExpenses,
				userOrdersAverage.averageExpenses
			),
			income: percentageDifference(
				currentMonthAverage.averageIncome,
				userOrdersAverage.averageIncome
			),
		};

		res.json({
			averages: {
				overall: allOrdersAverage,
				userSpecific: userOrdersAverage,
				currentMonth: currentMonthAverage,
			},
			percentageDifferences,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
