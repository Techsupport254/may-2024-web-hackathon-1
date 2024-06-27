import React from "react";
import "./BestSales.css";

const BestSales = ({ products, userData }) => {
	return (
		<div className="BestSales">
			{products.map((product, index) => {
				return (
					<div className="BestSalesProduct" key={index}>
						<div className="BestImage">
							<img src={product.images[0]} alt="product" />
						</div>
						<div className="BestDetails">
							<span>{product.productName}</span>
							<p>{product.productDescription}</p>
							<h3>
								KSh.{product.price}
								<small>
									{product.wholesale
										? ` - KSh.${product.wholesalePrice} (Wholesale)`
										: ""}
								</small>
							</h3>
							<button>SHOP NOW</button>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default BestSales;
