import React, { useState } from "react";
import "./ConsultRight.css";
import ConsultTable from "../ConsultTable/ConsultTable";
import AccountConsults from "../AccountConsults/AccountConsults";

const ConsultRight = ({ userData, toggleSidebar }) => {
	const [title, setTitle] = useState("");
	const [farmType, setFarmType] = useState("");
	const [urgency, setUrgency] = useState("");
	const [professional, setProfessional] = useState("");
	const [specificProfessional, setSpecificProfessional] = useState("");
	const [description, setDescription] = useState("");

	const [selectedConsult, setSelectedConsult] = useState(null);

	const handleFormSubmit = (e) => {
		e.preventDefault();

		// Create a new consult object
		const newConsult = {
			title,
			farmType,
			urgency,
			professional,
			specificProfessional,
			description,
			submittedAt: new Date().toLocaleString(),
			status: "Pending",
			settledAt: "",
			professionalName: "",
			amountCharged: 0,
		};

		// Add the new consult to the consults array
		setConsults((prevConsults) => [...prevConsults, newConsult]);

		// Reset the form fields
		setTitle("");
		setFarmType("");
		setUrgency("");
		setProfessional("");
		setSpecificProfessional("");
		setDescription("");
	};

	const handleConsultClick = (consult) => {
		setSelectedConsult(consult);
	};

	const handleCloseModal = () => {
		setSelectedConsult(null);
	};

	return (
		<div className="CRight">
			<div className="CRightTop">
				<i className="fas fa-bars" onClick={toggleSidebar}></i>
				<h3>Consults</h3>
			</div>
			<div className="CRightContainer">
				<AccountConsults userData={userData} />
			</div>
		</div>
	);
};

export default ConsultRight;
