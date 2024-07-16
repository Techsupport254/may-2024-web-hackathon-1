import React, { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import "./Categories.css";
import { CategoriesData } from "../../Data";
import ProductCards from "../../Components/ProductCards/ProductCards";

const Categories = ({ products, userData }) => {
	const categoryRefs = useRef([]);
	const [activeCategory, setActiveCategory] = useState(null);

	const uniqueCategories = useMemo(() => {
		const categories = products.map((product) => product.subCategory);
		return [...new Set(categories)];
	}, [products]);

	const handleCategoryClick = (index) => {
		setActiveCategory(index);
	};

	const renderCategoryComponent = (title) => {
		const filteredProducts =
			title === "All"
				? products
				: products.filter((product) => product.category === title);

		const shouldShowAll =
			activeCategory === null ||
			activeCategory ===
				CategoriesData.findIndex((item) => item.title === title);

		if (shouldShowAll) {
			return filteredProducts.length === 0 ? (
				<div className="NA">
					<i className="fas fa-exclamation-triangle"></i>
					<p>No product available for this category</p>
				</div>
			) : (
				<ProductCards userData={userData} products={filteredProducts} />
			);
		} else {
			const limitedProducts = filteredProducts.slice(0, 10);
			return <ProductCards userData={userData} products={limitedProducts} />;
		}
	};

	return (
		<div className="Categories">
			<div className="CategoriesItems">
				<div className="Header">
					<h3>Categories</h3>
					<p>
						Select a category to view the products available in that category or
						sub-category below the categories list.
					</p>
				</div>
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
				{CategoriesData.map(
					(item, index) =>
						index !== activeCategory && (
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
						)
				)}
			</div>
		</div>
	);
};

Categories.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			subCategory: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
		})
	).isRequired,
	userData: PropTypes.object.isRequired,
};

export default Categories;
