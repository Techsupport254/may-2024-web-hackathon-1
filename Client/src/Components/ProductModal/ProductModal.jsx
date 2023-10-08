import React, { useState, useEffect } from "react";
import "./ProductModal.css";
import { Link, useParams } from "react-router-dom";

const ProductModal = ({ products }) => {
	const id = useParams().id;

	const [currentImage, setCurrentImage] = useState(0);
	const [menuVisible, setMenuVisible] = useState(false);

	const product = products.find((product) => product?._id === id);
	console.log(product);
	const tags = product?.tags?.[0]?.split(",") || [];

	return (
		<div className="ProductModal">
			<div className="ProductTop">
				<div className="ProductLeft">
					<div className="ProductImages">
						<img
							src={product?.images[currentImage]}
							alt={product?.productName}
						/>
					</div>
					<div className="ImagePreview">
						{product?.images.map((image, index) => (
							<img
								key={index}
								src={image}
								alt={product.productName}
								onClick={() => setCurrentImage(index)}
								className={index === currentImage ? "Active" : ""}
							/>
						))}
					</div>
				</div>
				<div className="ProductRight">
					<div className="ProductTitle">
						<h3>
							{product?.productName}
							<li>{product?.productCategory}</li>
						</h3>
						<p>Brand: {product?.brandName}</p>
					</div>
					<div className="ProductDetails">
						<p>{product?.productDescription}</p>
						<p>
							<b>Stock:</b> {product?.stock} Available
						</p>
						<p>
							<b>Weight:</b> {product?.productWeight}
						</p>
					</div>
					<div className="Price">
						<h3>
							KES{" "}
							{product?.price !== undefined
								? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
								: ""}
						</h3>
						{product?.wholesale === true && (
							<p>
								Buy {product?.wholesaleRate} such products @ KES{" "}
								<b>
									{product?.wholesalePrice !== undefined
										? product.wholesalePrice
												.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
										: ""}
								</b>
								from Agrisolve
							</p>
						)}
					</div>

					<div className="Tags">
						<i className="fa fa-tags"></i>
						{tags.map((tag, index) => (
							<span key={index}>{tag}</span>
						))}
					</div>
					<div className="ProductBtns">
						<button className="AddToCart">Add to Cart</button>
						<button className="BuyNow">Buy Now</button>
					</div>
					<div className="Usage">
						<h3>Usage Instructions</h3>
						<p>{product?.instructions}</p>
					</div>
					<div className="Packaging">
						<h3>Packaging</h3>
						<p>{product?.packagingType}</p>
					</div>
					<div className="Labels">
						<h3>Labels</h3>
						<p>{product?.labels}</p>
					</div>
				</div>
			</div>
			<div className="ProductBottom">
				<h3>You may also like</h3>
				<div className="ProductBottomContainer">
					{products.map((product, index) => (
						<Link
							to={`/product/${product?._id}`}
							className="ProductCard"
							key={index}
						>
							<div className="ProductCardImage">
								<img src={product?.images[0]} alt={product?.productName} />
							</div>
							<div className="ProductCardDetails">
								<h3>{product?.productName}</h3>
								<p>KES {product?.price}</p>
								<small>{product?.productCategory}</small>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductModal;
