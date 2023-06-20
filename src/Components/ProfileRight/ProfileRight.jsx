import React from "react";
import "./ProfileRight.css";
import Orders from "../Orders/Orders";
import ProfileAccount from "../ProfileAccount/ProfileAccount";
import Notifications from "../Notifications/Notifications";
import AccountConsults from "../AccountConsults/AccountConsults";
import AccountCart from "../AccountCart/AccountCart";
import AccountSettings from "../AccountSettings/AccountSettings";

const ProfileRight = ({ activeMenu, userData, isLoggedin }) => {
	const components = {
		"My Account": (
			<ProfileAccount userData={userData} isLoggedin={isLoggedin} />
		),
		Notifications: (
			<Notifications userData={userData} isLoggedin={isLoggedin} />
		),
		"My Orders": <Orders userData={userData} isLoggedin={isLoggedin} />,
		Consults: <AccountConsults userData={userData} isLoggedin={isLoggedin} />,
		"My Cart": <AccountCart userData={userData} isLoggedin={isLoggedin} />,
		Settings: <AccountSettings userData={userData} isLoggedin={isLoggedin} />,
	};

	const getContent = () => {
		return components[activeMenu] || components["My Account"];
	};

	return (
		<div className="ProfileRight">
			<h3>
				Account Overview {">"} {activeMenu}
			</h3>
			<div className="ProfileRightContainer">{getContent()}</div>
		</div>
	);
};

export default ProfileRight;
