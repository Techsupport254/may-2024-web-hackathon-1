import React from "react";
import "./TopRight.css";
import { AgriproffesionalsData } from "../../Data";

const TopRight = () => {
	return (
		<div className="TopRight">
			<h3>AgriProffesionals</h3>
			{AgriproffesionalsData.map((item, index) => {
				return (
					<div className="TopRightItem" key={index}>
						<div className="Image">
							<img src={item.image} alt={item.name} />
						</div>
						<div className="Title">
							<span>{item.name}</span>
							<span>{item.type}</span>
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
