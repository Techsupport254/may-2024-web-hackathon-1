import React, { useState, useContext } from "react";
import "./Profile.css";
import ProfileLeft from "../profileLeft/ProfileLeft";
import ProfileRight from "../ProfileRight/ProfileRight";
import { ApiContext } from "../../Context/ApiProvider";

const Profile = ({ isLoggedin, shippingData, paymentData }) => {
	const { userData } = useContext(ApiContext);
	const [activeMenu, setActiveMenu] = useState("");

	const handleMenuClick = (item) => {
		setActiveMenu(item);
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
