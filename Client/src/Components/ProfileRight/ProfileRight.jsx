import React from "react";
import "./ProfileRight.css";
import ProfileAccount from "../ProfileAccount/ProfileAccount";
import AccountSettings from "../AccountSettings/AccountSettings";
import PropTypes from "prop-types";

const ProfileRight = ({ userData, isLoggedin, paymentData, shippingData }) => {
	return (
		<div className="ProfileRight">
			<div className="ProfileRightContainer">
				<ProfileAccount
					userData={userData}
					isLoggedin={isLoggedin}
					paymentData={paymentData}
					shippingData={shippingData}
					className="ProfileAccount"
				/>
				<AccountSettings
					userData={userData}
					isLoggedin={isLoggedin}
					className="AccountSettings"
				/>
			</div>
		</div>
	);
};

export default ProfileRight;

// props validation
ProfileRight.propTypes = {
	activeMenu: PropTypes.string.isRequired,
	userData: PropTypes.object.isRequired,
	isLoggedin: PropTypes.bool.isRequired,
	paymentData: PropTypes.object.isRequired,
	shippingData: PropTypes.object.isRequired,
};
