import "./NotFound.css";
import Logo from "../../assets/logo.png";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

const NotFound = ({ userData }) => {
	return (
		<div className="NotFound">
			<div className="NotFoundContainer FlexDisplay">
				<div className="NotFoundLogo FlexDisplay">
					<h1>404</h1>
					<p>Page Not Found</p>
					<img src={Logo} alt="logo" />
					<span>
						Agri
						<span>solve</span>{" "}
					</span>
				</div>
				<div className="NotFoundContent FlexDisplay">
					<p>
						Hello,
						{/* <span>{userData ? userData?.name?.split(" ")[0] : "User"}</span>, */}
						The page you're looking for doesn't exist.
					</p>
					<Button
						variant="outlined"
						style={{ color: "var(--primary-darker)", border: "1.5px solid var(--primary-darker)"}}
						href="/"
					>
						Go Back To Home Page
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NotFound;

// validate props

NotFound.propTypes = {
	userData: PropTypes.object,
};
