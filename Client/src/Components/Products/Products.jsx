import React from "react";
import "./Products.css";
import ProductCards from "../ProductCards/ProductCards";
import { ProductsData } from "../../Data";

const Products = () => {
	const limitedProducts = limitProducts(ProductsData, 20);

	return (
		<div className="Products">
			<h3>Products</h3>
			<ProductCards products={limitedProducts} />
		</div>
	);
};

const limitProducts = (products, limit) => {
	return products.slice(0, limit);
};

export default Products;
