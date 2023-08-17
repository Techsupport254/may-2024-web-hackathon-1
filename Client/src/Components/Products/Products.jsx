import React from "react";
import "./Products.css";
import ProductCards from "../ProductCards/ProductCards";

const Products = ({ products }) => {
	const limitedProducts = limitProducts(products, 20);

	return (
		<div className="Products">
			<ProductCards products={limitedProducts} />
		</div>
	);
};

const limitProducts = (products, limit) => {
	return products.slice(0, limit);
};

export default Products;
