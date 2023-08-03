import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./TopRight.css";

const TopRight = ({ userData }) => {
	const [loading, setLoading] = useState(true);
	const [dataLoaded, setDataLoaded] = useState(false);

	useEffect(() => {
		// Simulate loading for 5 seconds
		const timer = setTimeout(() => {
			setLoading(false);
		}, 5000);

		// Clear the timer when the component unmounts or when userData changes (data is available)
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		// Check if userData is available
		if (userData.length > 0) {
			setDataLoaded(true);
			setLoading(false);
		} else {
			setDataLoaded(false);
		}
	}, [userData]);

	return (
		<div className="TopRight">
			{loading ? (
				<div
					className="SpinnerLoader"
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<i
						className="fas fa-spinner fa-spin"
						style={{
							fontSize: "1.5rem",
							color: "green",
						}}
					></i>
				</div>
			) : (
				<>
					<h3>Agribusinesses</h3>
					{dataLoaded ? (
						Array.isArray(userData) &&
						userData.map((user, index) => {
							return (
								<div className="TopRightItem" key={index}>
									<div className="Image">
										<img
											src={
												user.profilePicture
													? `https://agrisolve-techsupport254.vercel.app/uploads/${
															user.profilePicture
													  }?${Date.now()}`
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
						})
					) : (
						<div
							className="ErrorLoading"
							
							
						>
							<i className="fas fa-exclamation-triangle"></i>
							<p
								style={{
									fontSize: "1rem",
								}}
							>
								Could not load data
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};

TopRight.defaultProps = {
	userData: [],
};

TopRight.propTypes = {
	userData: PropTypes.arrayOf(
		PropTypes.shape({
			profilePicture: PropTypes.string,
			name: PropTypes.string,
			businessType: PropTypes.string,
		})
	).isRequired,
};

export default TopRight;
