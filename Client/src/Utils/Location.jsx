import { useState, useEffect } from "react";

const useCurrentLocation = () => {
	const [currentLocation, setCurrentLocation] = useState({
		latitude: 0,
		longitude: 0,
		name: "",
		address: "",
	});

	useEffect(() => {
		const getLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { latitude, longitude } = position.coords;
						setCurrentLocation({ latitude, longitude });

						try {
							const response = await fetch(
								`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
							);

							if (!response.ok) {
								throw new Error("Failed to fetch address.");
							}

							const data = await response.json();

							if (data.results && data.results.length > 0) {
								setCurrentLocation({
									latitude,
									longitude,
									name: data.results[0].formatted_address,
									address: data.results[0].formatted_address,
								});
							}
						} catch (error) {
							console.error("Error fetching address:", error);
						}
					},
					(error) => {
						console.error("Error getting location:", error);
					}
				);
			} else {
				console.error("Geolocation is not supported by this browser.");
			}
		};

		getLocation();
	}, []); // Empty dependency array ensures this effect runs only once

	return currentLocation;
};

export default useCurrentLocation;
