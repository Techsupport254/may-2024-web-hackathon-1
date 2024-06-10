import { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import PropTypes from "prop-types";
import "./AvailableLocations.css";

const AvailableLocations = ({
	setSelectedLocation,
	setIsLocationSelected,
	setDeliveryFee,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [locations, setLocations] = useState([]);
	const [selected, setSelected] = useState(null);
	const [nearestBranch, setNearestBranch] = useState(null);

	// Branches data
	const branches = [
		{ name: "Ruiru", coordinates: [-1.1774574, 36.98242850646827] },
		{ name: "Juja", coordinates: [-1.10545095, 37.01266481323846] },
		{ name: "Nairobi CBD", coordinates: [-1.2832533, 36.8172449] },
	];

	// Handle search input change and perform search
	const handleSearchChange = async (event) => {
		const value = event.target.value;
		setSearchTerm(value);
		if (value.length > 2) {
			try {
				const response = await axios.get(
					`https://nominatim.openstreetmap.org/search?format=json&q=${value}`
				);
				setLocations(response.data);
				setSelected(null);
			} catch (error) {
				console.error("Error fetching data: ", error);
				setLocations([]);
			}
		} else {
			setLocations([]);
		}
	};

	// Calculate distance between two coordinates in kilometers
	const calculateDistance = (coord1, coord2) => {
		const [lat1, lon1] = coord1;
		const [lat2, lon2] = coord2;
		const R = 6371; // Radius of the Earth in km
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;
		return distance.toFixed(2);
	};

	// Handle location selection
	const selectLocation = (location) => {
		setSelectedLocation({
			...location,
			lat: parseFloat(location.lat),
			lon: parseFloat(location.lon),
		});
		setIsLocationSelected(true);

		let nearest = branches[0];
		let minDistance = calculateDistance(
			[parseFloat(location.lat), parseFloat(location.lon)],
			branches[0].coordinates
		);

		branches.forEach((branch) => {
			const distance = calculateDistance(
				[parseFloat(location.lat), parseFloat(location.lon)],
				branch.coordinates
			);
			if (distance < minDistance) {
				minDistance = distance;
				nearest = branch;
			}
		});

		setNearestBranch(nearest);
		setSelected(location);
		console.log("Nearest Branch:", nearest.name, "Distance:", minDistance);

		const amount = Math.round((minDistance / 30) * 100);
		setDeliveryFee(amount);
		console.log("Rounded Delivery Fee:", amount);
	};

	return (
		<div className="AvailableLocations">
			<TextField
				placeholder="Search Location"
				size="small"
				fullWidth
				value={searchTerm}
				onChange={handleSearchChange}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<i
								className="fa-solid fa-location-dot"
								style={{
									fontSize: "1.5rem",
									color: " var(--success)",
								}}
							></i>
						</InputAdornment>
					),
				}}
			/>
			<div className="SelectedLocation">
				{selected ? (
					<div
						className="SelectedLocation"
						onClick={() => selectLocation(selected)}
					>
						<h3>Selected Location</h3>
						<p>{selected.display_name}</p>
						<i
							className="fa-solid fa-right-left"
							style={{
								display: "flex",
								alignContent: "center",
								alignItems: "center",
								justifyContent: "center",
								fontSize: "2rem",
								color: "green",
								margin: ".5rem 0",
							}}
						></i>
						<h3>Nearest Branch</h3>
						{nearestBranch && <p>{nearestBranch.name}</p>}
					</div>
				) : (
					locations.map((location, index) => (
						<div
							className="SelectedLocation"
							key={index}
							onClick={() => {
								selectLocation(location);
								setSearchTerm(location.display_name);
							}}
						>
							<p>{location.display_name}</p>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default AvailableLocations;

// validate props

AvailableLocations.propTypes = {
	setSelectedLocation: PropTypes.func.isRequired,
	setIsLocationSelected: PropTypes.func.isRequired,
	setDeliveryFee: PropTypes.func.isRequired,
};
