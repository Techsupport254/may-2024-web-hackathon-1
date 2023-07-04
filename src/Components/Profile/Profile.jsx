import React, { useState } from "react";
import "./Profile.css";
import ProfileLeft from "../profileLeft/ProfileLeft";
import ProfileRight from "../ProfileRight/ProfileRight";

const Profile = ({ userData, isLoggedin, shippingData, paymentData }) => {
	const [activeMenu, setActiveMenu] = useState(""); // State to keep track of active menu item

	const handleMenuClick = (item) => {
		setActiveMenu(item); // Update the active menu item
	};

	return (
		<div className="Profile">
			<div className="LeftProfile">
				<ProfileLeft
					userData={userData}
					isLoggedin={isLoggedin}
					activeMenu={activeMenu}
					onMenuClick={handleMenuClick}
				/>
			</div>
			<div className="RightProfile">
				<ProfileRight
					userData={userData}
					isLoggedin={isLoggedin}
					activeMenu={activeMenu}
					paymentData={paymentData}
					shippingData={shippingData}
				/>
			</div>
		</div>
	);
};

export default Profile;
