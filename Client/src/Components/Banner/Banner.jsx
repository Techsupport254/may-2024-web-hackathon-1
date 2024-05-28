import "./Banner.css";
import BannerCard from "../BannerCard/BannerCard";
import propTypes from "prop-types";

const Banner = ({ products, userData }) => {
	return (
		<div className="BannerContainer">
			<div className="ProfileRecommendations">
				{userData ? (
					<img
						src={userData?.profilePicture}
						alt="profile"
						className="ProfilePicture"
					/>
				) : null}
				<div className="ProfileDet">
					<span>Hi, {userData?.name ? userData.name : "user"}</span>
					<p>Recommendations just for you👉</p>
				</div>
			</div>
			{products.map((product, index) => (
				<div className="BannerCard" key={index}>
					<BannerCard product={product} userData={userData} />
				</div>
			))}
		</div>
	);
};

export default Banner;

// validate

Banner.propTypes = {
	products: propTypes.array.isRequired,
	userData: propTypes.object.isRequired,
};
