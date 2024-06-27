import "./Landing.css";
import Farm from "../../assets/farm.png";
import propTypes from "prop-types";
import { Button } from "@mui/material";

const Landing = ({ product, userData }) => {
	return (
		<div className="LandingContainer FlexDisplay">
			<div className="LandingLeft">
				<h1>Agrisolve</h1>
				<span>Sales upto 25% off</span>
				{window.innerWidth < 768 && (
					<div className="LandingImage">
						<img src={Farm} alt="Farm" />
					</div>
				)}
				<p>
					Agrisolve is a platform that connects farmers to buyers and sellers of
					agricultural products and services. It also provides a platform for
					farmers to get agricultural advice from experts. We are here to help
					you grow.
				</p>
				<div className="LandingBtns FlexDisplay">
					<Button
						variant="outlined"
						onClick={() => {
							window.location.href = "/products";
						}}
						size="large"
						startIcon={<i className="fas fa-shopping-cart"></i>}
						style={{
							border: "solid var(--bg-color)",
							color: "var(--bg-color)",
						}}
					>
						Shop Now
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							window.location.href = "/register";
						}}
						size="large"
						style={{ backgroundColor: "var(--bg-color)" }}
					>
						Get Started
					</Button>
				</div>
			</div>
			{window.innerWidth > 768 && (
				<div className="LandingRight">
					<div className="LandingImage">
						<img src={Farm} alt="Farm" />
					</div>
				</div>
			)}
		</div>
	);
};

export default Landing;

// validate

Landing.propTypes = {
	product: propTypes.object.isRequired,
	userData: propTypes.object.isRequired,
};
