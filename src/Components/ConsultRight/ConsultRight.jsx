import React, { useState } from "react";
import "./ConsultRight.css";
import ConsultTable from "../ConsultTable/ConsultTable";
import AccountConsults from "../AccountConsults/AccountConsults";

const ConsultRight = () => {
	const [title, setTitle] = useState("");
	const [farmType, setFarmType] = useState("");
	const [urgency, setUrgency] = useState("");
	const [professional, setProfessional] = useState("");
	const [specificProfessional, setSpecificProfessional] = useState("");
	const [description, setDescription] = useState("");
	const [consults, setConsults] = React.useState([
		{
			id: 1,
			title: "Consult 1",
			farmType: "Dairy",
			status: "Pending",
			description: "Consult 1 Description",
			submittedAt: "12/12/2020",
		},
		{
			id: 2,
			title: "Consult 2",
			farmType: "Dairy",
			status: "Solved",
			professionalName: "Dr. John Doe",
			settledAt: "12/12/2020",
			description: "Consult 2 Description",
			submittedAt: "12/12/2020",
			amountCharged: "100",
		},
		{
			id: 3,
			title: "Consult 3",
			farmType: "Dairy",
			status: "Pending",
			description: "Consult 3 Description",
			submittedAt: "12/12/2020",
		},
		{
			id: 4,
			title: "Consult 4",
			farmType: "Dairy",
			status: "Pending",
			description: "Consult 4 Description",
			submittedAt: "12/12/2020",
		},
	]);

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
			<h3>Consults</h3>
			<div className="CRightContainer">
				<AccountConsults />
			</div>
		</div>
	);
};

export default ConsultRight;
