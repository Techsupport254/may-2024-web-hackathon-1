import React, { Suspense, useState } from "react";
import "./ProductCards.css";
import Skeleton from "../Skeleton/Skeleton";
import ProductModal from "../../Pages/ProductModal/ProductModal";
import { AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const SkeletonProduct = () => <Skeleton />;

const LazyProductCard = React.lazy(() => import("../ProductCard/ProductCard"));

const ProductCards = ({ products, isLoading, userData }) => {
	if (isLoading) {
		return (
			<div className="ProductCards">
				<SkeletonProduct />
			</div>
		);
	}

	return (
		<div className="ProductCards">
			<Suspense fallback={<SkeletonProduct />}>
				{products?.map((product) => (
					<LazyProductCard
						key={product._id}
						product={product}
						isLoading={isLoading}
						userData={userData}
					/>
				))}
			</Suspense>
		</div>
	);
};

export default ProductCards;

// validate props

ProductCards.propTypes = {
	products: PropTypes.array.isRequired,
	isLoading: PropTypes.bool.isRequired,
	userData: PropTypes.object.isRequired,
};
