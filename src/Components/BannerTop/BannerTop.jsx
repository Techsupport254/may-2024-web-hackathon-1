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

	// Fetching the data from the API
	useEffect(() => {
		const fetchUsersData = async () => {
			try {
				const response = await axios.get("http://localhost:4000/auth/users");
				setUserData(response.data);

				// check if the user is logged in or not
				if (response.data.length > 0) {
					setIsLoggedin(true);
				}

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
			} catch (err) {
				console.log(err);
			}
		};

		fetchUsersData();
	}, []);

	// check if the data is loaded or not
	if (userData.length === 0) {
		return (
			<div>
				<i className="fas fa-spinner fa-spin"></i>
			</div>
		);
	}

	return (
		<div className="BannerTop">
			<div className="BannerLeft">
				<TopLeft userData={agriproffesionals} isLoggedin={isLoggedin} />
			</div>
			<div className="BannerCenter">
				<TopCenter />
			</div>
			<div className="BannerRight">
				<TopRight
					userData={Agribusinesses}
					isLoggedin={isLoggedin}
					setIsLoggedin={setIsLoggedin}
				/>
			</div>
		</div>
	);
};

export default BannerTop;
