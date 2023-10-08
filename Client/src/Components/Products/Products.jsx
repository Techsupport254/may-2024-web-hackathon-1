import React from "react";
import "./Products.css";
import ProductCards from "../ProductCards/ProductCards";

const Products = ({ products, userData }) => {
	const limitedProducts = limitProducts(products, 20);

	return (
		<div className="Products">
			<ProductCards products={limitedProducts} userData={userData} />
		</div>
	);
};

const limitProducts = (products, limit) => {
	return products.slice(0, limit);
};

export default Products;
