import "./Products.css";
import ProductCards from "../../Components/ProductCards/ProductCards";
import propTypes from "prop-types";
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

// validate props

Products.propTypes = {
	products: propTypes.array.isRequired,
	userData: propTypes.object.isRequired,
};
