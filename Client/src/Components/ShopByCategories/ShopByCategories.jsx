import "./ShopByCategories.css";
import propTypes from "prop-types";
import { CategoriesData } from "../../Data";

const ShopByCategories = ({ products, userData }) => {
	return (
		<div className="ShopByCategories FlexDisplay">
			<div className="Header">
				<h3>Shop By Categories</h3>
			</div>
			<div className="CategoriesShop FlexDisplay">
				{CategoriesData.map((item, index) => (
					<div className="CategoryItem" key={index}>
						<div className="CategoryImage">
							<img src={item.image} alt={item.title} />
						</div>
						<div className="CategoryTitle">
							<span>{item.title}</span>
							<p>
								{item.title === "All"
									? products.length
									: products.filter(
											(product) => product.category === item.title
									  ).length}{" "}
								Products
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ShopByCategories;

// validate props

ShopByCategories.propTypes = {
	products: propTypes.array,
	userData: propTypes.object,
};
