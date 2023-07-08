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

	axios.defaults.withCredentials = true;

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
			} catch (err) {
				console.log(err);
			}
		};

		fetchUsersData();
	}, []);

	return (
		<div className="BannerTop">
			<div className="BannerLeft">
				<TopLeft userData={agriproffesionals} />
			</div>
			<div className="BannerCenter">
				<TopCenter />
			</div>
			<div className="BannerRight">
				<TopRight userData={Agribusinesses} />
			</div>
		</div>
	);
};

export default BannerTop;
