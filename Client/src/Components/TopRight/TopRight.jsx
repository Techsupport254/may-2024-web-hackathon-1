import React from "react";
import "./TopRight.css";

const TopRight = ({ userData }) => {
	return (
		<div className="TopRight">
			<h3>Agribusinesses</h3>
			{userData.map((user, index) => {
				return (
					<div className="TopRightItem" key={index}>
						<div className="Image">
							<img
								src={
									user.image
										? user.image
										: "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
								}
								alt={user.name}
							/>
						</div>
						<div className="Title">
							<span>{user.name}</span>
							<span>{user.businessType}</span>
						</div>
						<div className="Icon">
							<i className="fas fa-caret-down"></i>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default TopRight;
