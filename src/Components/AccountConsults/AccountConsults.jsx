import React from "react";
import "./AccountConsults.css";
import ConsultTable from "../ConsultTable/ConsultTable";
import ConsultRight from "../ConsultRight/ConsultRight";

const AccountConsults = () => {
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

	const [selectedConsult, setSelectedConsult] = React.useState(null);
	const handleConsultClick = (consult) => {
		setSelectedConsult(consult);
	};

	return (
		<div className="AccountConsults">
			<div className="AccountConsultsContainer">
				<div className="AccountConsultsTop">
					<button className="AddConsult">
						<i class="fas fa-plus-circle"></i> Add New Consult
					</button>
					<div className="Accepted">
						<div className="AcceptedConsults">
							<i class="fas fa-check-circle"></i> 4 Accepted
						</div>
						<div className="Incoming">
							<i class="fas fa-exclamation-circle"></i> 2 Incoming
						</div>
					</div>
				</div>
				<ConsultTable
					consults={consults}
					handleConsultClick={handleConsultClick}
				/>
			</div>
		</div>
	);
};

export default AccountConsults;
