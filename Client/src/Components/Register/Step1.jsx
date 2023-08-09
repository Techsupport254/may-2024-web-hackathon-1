import "./Register.css";
import { TextField } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Modal, Spin } from "antd";
import React, { useState, useEffect } from "react";

const Step1 = ({ onNextStep }) => {
	const [userType, setUserType] = useState("");
	const [farmingType, setFarmingType] = useState("");
	const [businessType, setBusinessType] = useState("");
	const [businessName, setBusinessName] = useState("");
	const [businessLocation, setBusinessLocation] = useState("");
	const [formData, setFormData] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const handleOpenModal = () => {
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		const storedFormData = localStorage.getItem("formData");
		const parsedFormData = storedFormData ? JSON.parse(storedFormData) : {};
		const userType = parsedFormData.userType || "";
		const farmingType = parsedFormData.farmingType || "";

		setUserType(userType);
		setFarmingType(farmingType);
	}, []);

	useEffect(() => {
		// Check the form validity whenever userType, farmingType, or formData changes
		setIsFormValid(validateForm());
	}, [userType, farmingType, formData]);

	const handleContinue = (e) => {
		e.preventDefault();

		// Show the loading modal
		setLoading(true);

		const formData1 = { ...formData };

		if (userType === "farmer") {
			formData1.userType = userType;
			formData1.farmingType = farmingType;

			if (farmingType === "crop") {
				const { acreage } = e.target.elements;

				if (!acreage.value) {
					// Input value is empty
					return;
				}

				formData1.acreage = acreage.value;
			} else {
				const { quantity } = e.target.elements;

				if (!quantity.value) {
					// Input value is empty
					return;
				}

				formData1.quantity = quantity.value;
			}
		} else if (["agribusiness", "agriprofessional"].includes(userType)) {
			const {
				businessName,
				businessLocation,
				businessType,
				businessDescription,
			} = e.target.elements;

			if (
				!businessName.value ||
				!businessLocation.value ||
				!businessDescription.value
			) {
				// Input values are empty
				return;
			}

			formData1.userType = userType;
			formData1.businessName = businessName.value;
			formData1.businessType = businessType.value;
			formData1.businessLocation = businessLocation.value;
			formData1.businessDescription = businessDescription.value;
		}

		setFormData(formData1);
		localStorage.setItem("formData1", JSON.stringify(formData1));

		// Delay onNextStep() to simulate an asynchronous operation
		setTimeout(() => {
			// Hide the loading modal
			setLoading(false);
			onNextStep();
		}, 2000);
	};

	const validateForm = () => {
		if (userType === "farmer") {
			if (farmingType === "crop") {
				const { acreage } = document.forms[0].elements;
				return !!acreage.value;
			} else {
				const { quantity } = document.forms[0].elements;
				return !!quantity.value;
			}
		} else if (["agribusiness", "agriprofessional"].includes(userType)) {
			const { businessName, businessLocation, businessDescription } =
				document.forms[0].elements;
			return (
				!!businessName.value &&
				!!businessLocation.value &&
				!!businessDescription.value
			);
		}

		return false;
	};

	const renderFormFields = () => {
		const farmingOptions = [
			{ value: "livestock", label: "Livestock Farming" },
			{ value: "crop", label: "Crop Farming" },
			{ value: "poultry", label: "Poultry Farming" },
		];

		if (userType === "farmer") {
			return (
				<div className="RegisterInputs">
					<div className="RegisterInput">
						<TextField
							label="Type of Farming"
							variant="outlined"
							name="farmingType"
							id="farmingType"
							value={farmingType}
							onChange={(e) => setFarmingType(e.target.value)}
							select
							fullWidth
						>
							{farmingOptions.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</div>
					{farmingType === "crop" ? (
						<div className="RegisterInput">
							<TextField
								label="Acreage"
								variant="outlined"
								name="acreage"
								id="acreage"
								placeholder="Enter the size of the farm"
								fullWidth
							/>
						</div>
					) : (
						<div className="RegisterInput">
							<TextField
								label="Quantity"
								variant="outlined"
								name="quantity"
								id="quantity"
								placeholder={`Approximate number of ${
									farmingType === "livestock" ? "animals" : "birds"
								}`}
								fullWidth
							/>
						</div>
					)}
				</div>
			);
		}

		if (["agribusiness", "agriprofessional"].includes(userType)) {
			const businessOptions = [
				{ value: "general", label: "General" },
				...farmingOptions,
			];

			return (
				<div className="RegisterInputs">
					<div className="RegisterInput">
						<TextField
							label="Business Name"
							variant="outlined"
							name="businessName"
							id="businessName"
							fullWidth
							size="small"
						/>
						<TextField
							label="Business Type"
							variant="outlined"
							name="businessType"
							id="businessType"
							value={businessType}
							onChange={(e) => setBusinessType(e.target.value)}
							select
							fullWidth
							size="small"
						>
							{businessOptions.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</div>
					<div className="RegisterInput" style={{ width: "100%" }}>
						<TextField
							label="Business Location"
							variant="outlined"
							name="businessLocation"
							id="businessLocation"
							value={businessLocation}
							onChange={(e) => setBusinessLocation(e.target.value)}
							fullWidth
							size="small"
						/>
					</div>
					<div
						className="RegisterInput"
						style={{
							width: "100%",
						}}
					>
						<TextField
							label="Business Description"
							variant="outlined"
							name="businessDescription"
							id="businessDescription"
							multiline
							rows={4}
							fullWidth
							size="small"
						/>
					</div>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="RegisterForm">
			<form
				onSubmit={handleContinue}
				style={{
					width: "90%",
					display: "flex",
					flexWrap: "wrap",
				}}
			>
				{renderFormFields()}
				<div className="RegisterButtons">
					<button
						type="submit"
						className="RegisterBtn"
						onClick={handleOpenModal}
					>
						Continue
						<i className="fas fa-arrow-right"></i>
					</button>
				</div>
				{/* Loading modal */}
				{loading && (
					<Modal
						open={showModal}
						footer={null}
						closeIcon={null}
						closable={false}
						wrapClassName="LoadingModal"
					>
						<div className="Spinner">
							<Spin
								size="large"
								indicator={
									<i
										className="fas fa-spinner fa-spin"
										style={{ fontSize: 30, color: "#000", margin: 10 }}
									/>
								}
							/>
						</div>
						<p>
							<strong>Updating more details</strong>
						</p>
						<p>Please wait...</p>
					</Modal>
				)}
			</form>
		</div>
	);
};

export default Step1;
