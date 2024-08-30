import React, { useState, useContext } from "react";
import "./Profile.css";
import ProfileLeft from "../profileLeft/ProfileLeft";
import ProfileRight from "../ProfileRight/ProfileRight";
import { ApiContext } from "../../Context/ApiProvider";
import PropTypes from "prop-types";

const Profile = ({ isLoggedin, shippingData, paymentData }) => {
	const { userData } = useContext(ApiContext);

	return (
		<div className="Profile">
			<ProfileRight
				userData={userData}
				isLoggedin={isLoggedin}
				paymentData={paymentData}
				shippingData={shippingData}
			/>
		</div>
	);
};

export default Profile;

// props validation
Profile.propTypes = {
	isLoggedin: PropTypes.bool.isRequired,
	shippingData: PropTypes.object.isRequired,
	paymentData: PropTypes.object.isRequired,
};
