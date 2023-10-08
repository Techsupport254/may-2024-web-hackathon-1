import React from "react";
import "./Popular.css";
import ProductCard from "../ProductCard/ProductCard";

const Popular = ({ products, userData }) => {
	return (
		<div className="PopularContainer">
			{products.map((product, index) => (
				<div className="PopularCard" key={index}>
					<ProductCard
						product={product}
						isLoading={false}
						onProductClick={() => {}}
						userData={userData}
					/>
				</div>
			))}
		</div>
	);
};

export default Popular;
