import React from "react";
import "./ProfileLeft.css";
import { profileLeftData } from "../../Data";

const ProfileLeft = ({ activeMenu, onMenuClick, userData, isLoggedin, handleLogout }) => {
	return (
		<div className="ProfileLeft">
			<div className="ProfileLeftContainer">
				{profileLeftData.map((item, index) => {
					return (
						<div
							className={`ProfileLeftItem ${
								item.title === activeMenu ? "active" : ""
							}`}
							key={index}
							onClick={() => onMenuClick(item.title)} // Call the click event handler
						>
							{
								// If the item is "Account" and the user is logged in, then show the user's name
								item.title === "Account" && isLoggedin ? (
									<div className="ProfileLeftItemTitle">
										{userData.username}
									</div>
								) : (
									""
								)
							}
							<div className="ProfileLeftItemIcon">{item.icon}</div>
							<div className="ProfileLeftItemTitle">{item.title}</div>
						</div>
					);
				})}
			</div>
			<div className="BottomProfile">
				<div className="BottomProfileItem">
					<div className="ProfileLeftItemIcon">
						<i className="fas fa-sign-out-alt"></i>
					</div>
					<div className="ProfileLeftItemTitle">Logout</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileLeft;
