import PropTypes from "prop-types";

const ReviewsContainer = ({ product, productReviews, averageRating }) => {
	return (
		<div className="ReviewsContainer">
			<h3>Average Ratings</h3>
			<div className="RatingItems FlexDisplay">
				{Array.from({ length: averageRating }, (_, index) => (
					<i key={index} className="fas fa-star"></i>
				))}
				{Array.from({ length: 5 - averageRating }, (_, index) => (
					<i key={index + averageRating} className="far fa-star"></i>
				))}

				<span>{productReviews?.length} customer reviews</span>
			</div>
			<div className="ReviewContainer FlexDisplay">
				{productReviews?.map((review, index) => (
					<div className="ReviewItem FlexDisplay" key={index}>
						<div className="ReviewLeft">
							<img src={review?.image} alt={review?.name} />
						</div>
						<div className="ReviewRight FlexDisplay">
							<span>{review?.name}</span>
							<p>{product?.productDescription}</p>{" "}
							<div className="ReviewItems FlexDisplay">
								<div className="RatingsItems FlexDisplay">
									{Array.from({ length: review?.rating }, (_, index) => (
										<i key={index} className="fas fa-star"></i>
									))}
									{Array.from({ length: 5 - review?.rating }, (_, index) => (
										<i key={index + review?.rating} className="far fa-star"></i>
									))}
								</div>
								<div className="ReviewDate">
									<small>{review?.date}</small>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ReviewsContainer;

// validate props
ReviewsContainer.propTypes = {
	product: PropTypes.object.isRequired,
	productReviews: PropTypes.array.isRequired,
	averageRating: PropTypes.number.isRequired,
};
