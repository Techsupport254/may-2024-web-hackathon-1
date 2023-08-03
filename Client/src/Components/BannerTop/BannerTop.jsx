import React, { useState, useEffect } from "react";
import "./BannerTop.css";
import axios from "axios";
import TopLeft from "../TopLeft/TopLeft";
import TopCenter from "../TopCenter/TopCenter";
import TopRight from "../TopRight/TopRight";

const BannerTop = () => {
	const [userData, setUserData] = useState([]);
	const [isLoggedin, setIsLoggedin] = useState(false);
	const [agriproffesionals, setAgriproffesionals] = useState([]);
	const [Agribusinesses, setAgribusinesses] = useState([]);
	const [error, setError] = useState(null);

	// Fetching the data from the API
	useEffect(() => {
		const fetchUsersData = async () => {
			try {
				const response = await axios.get(
					"https://agrisolve-techsupport254.vercel.app/auth/users"
				);
				setUserData(response.data);

				// filter the data to get the agriproffesionals
				const agriproffesionalsData = response.data.filter(
					(user) => user.userType === "agriprofessional"
				);
				setAgriproffesionals(agriproffesionalsData);

				// filter the data to get the Agribusinesses
				const agribusinessesData = response.data.filter(
					(user) => user.userType === "agribusiness"
				);
				setAgribusinesses(agribusinessesData);

				setError(null);
			} catch (err) {
				setError("Could not load data.");
			}
		};

		fetchUsersData();
	}, []);

	return (
		<div className="BannerTop">
			<>
				<div className="BannerLeft">
					{error ? (
						<div className="Error">
							<i className="fas fa-exclamation-triangle"></i>
							<p>{error}</p>
						</div>
					) : (
						<TopLeft userData={agriproffesionals} />
					)}
				</div>
				<div className="BannerCenter">
					<TopCenter />
				</div>
				<div className="BannerRight">
					{error ? (
						<div className="Error">
							<i className="fas fa-exclamation-triangle"></i>
							<p>{error}</p>
						</div>
					) : (
						<TopRight userData={Agribusinesses} />
					)}
				</div>
			</>
		</div>
	);
};

export default BannerTop;
