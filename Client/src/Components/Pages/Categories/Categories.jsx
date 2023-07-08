import React, { useState, useRef } from "react";
import "./Categories.css";
import { CategoriesData, ProductsData } from "../../../Data";
import ProductCards from "../../ProductCards/ProductCards";

const Categories = () => {
	const categoryRefs = useRef([]);
	const [activeCategory, setActiveCategory] = useState(null);

	const handleCategoryClick = (index) => {
		setActiveCategory(index);
	};

	const renderCategoryComponent = (title) => {
		const filteredProducts = ProductsData.filter(
			(product) => product.category === title
		);

		if (
			activeCategory === null ||
			activeCategory ===
				CategoriesData.findIndex((item) => item.title === title)
		) {
			if (filteredProducts.length === 0) {
				return <p>No product available for this category</p>;
			} else {
				return <ProductCards products={filteredProducts} />;
			}
		} else {
			const limitedProducts = limitProducts(filteredProducts, 10);
			return <ProductCards products={limitedProducts} />;
		}
	};

	const limitProducts = (products, limit) => {
		return products.slice(0, limit);
	};

	return (
		<div className="Categories">
			<div className="CategoriesItems">
				<h3>Categories</h3>
				<div className="CategoryButtons">
					{CategoriesData.map((item, index) => (
						<button
							key={index}
							onClick={() => handleCategoryClick(index)}
							className={activeCategory === index ? "active" : ""}
						>
							{item.title}
						</button>
					))}
				</div>
			</div>
			<div className="CategoryContent">
				{activeCategory !== null && (
					<div
						className={`Category ${activeCategory === 0 ? "active" : ""}`}
						ref={(ref) => (categoryRefs.current[0] = ref)}
					>
						<h4>
							{CategoriesData[activeCategory].title}
							<i className="fas fa-caret-right"></i>
						</h4>
						<div className="CategoryContainer">
							{renderCategoryComponent(CategoriesData[activeCategory].title)}
						</div>
					</div>
				)}
				{CategoriesData.map((item, index) => {
					if (index !== activeCategory) {
						return (
							<div
								key={index}
								ref={(ref) => (categoryRefs.current[index] = ref)}
								className={`Category ${
									activeCategory === index ? "active" : ""
								}`}
							>
								<h4>{item.title}</h4>
								<div className="CategoryContainer">
									{renderCategoryComponent(item.title)}
								</div>
							</div>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
};

export default Categories;