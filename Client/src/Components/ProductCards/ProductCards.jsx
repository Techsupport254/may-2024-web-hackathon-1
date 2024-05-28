import React, { Suspense, useState } from "react";
import "./ProductCards.css";
import Skeleton from "../Skeleton/Skeleton";
import ProductModal from "../../Pages/ProductModal/ProductModal";
import {  AnimatePresence } from "framer-motion";

const SkeletonProduct = () => <Skeleton />;

const LazyProductCard = React.lazy(() => import("../ProductCard/ProductCard"));

const ProductCards = ({ products, isLoading,userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalContentClick = (productId) => {
    // Handle modal content click event
  };

  if (isLoading) {
    // Show skeleton loading effect
    return (
      <div className="ProductCards">
        <SkeletonProduct />
      </div>
    );
  }

  return (
    <div className="ProductCards">
      <Suspense fallback={<SkeletonProduct />}>
        {products.map((product) => (
          <LazyProductCard
            key={product.id}
            product={product}
            isLoading={isLoading}
            userData={userData}
            onProductClick={() => {
              setIsModalOpen(true);
              setSelectedProduct(product);
            }}
          />
        ))}
      </Suspense>
      <AnimatePresence>
        {isModalOpen && (
          <ProductModal
            isOpen={isModalOpen}
            selectedProduct={selectedProduct}
            onClose={handleModalClose}
            onContentClick={handleModalContentClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductCards;
