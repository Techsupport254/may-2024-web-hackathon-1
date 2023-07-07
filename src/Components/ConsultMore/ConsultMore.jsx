import React from "react";
import "./ConsultMore.css";
import { Badge, Step, StepLabel, Stepper } from "@mui/material";

const ConsultMore = ({ userData, consult }) => {
	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "pending":
				return "error";
			case "accepted":
				return "warning";
			case "solved":
				return "success";
			default:
				return "default";
		}
	};

	const getTimeLabel = (date) => {
		const currentTime = new Date();
		const timeDifference = Math.abs(currentTime - date); // Time difference in milliseconds
		const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours

		if (hoursDifference < 24) {
			return "Today";
		} else if (hoursDifference < 48) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString(); // Display the full date
		}
	};

	const activeStep = () => {
		if (consult.status === "pending") {
			return 1;
		} else if (consult.status === "accepted") {
			return 2;
		} else {
			return 3;
		}
	};

	return (
		<div className="ConsultMore">
			<div className="MoreLeft">
				<span>
					{consult.subject}
					<Badge
						color={getStatusBadgeColor(consult.status)}
						badgeContent={consult.status}
						style={{
							fontSize: "5px",
							fontWeight: "bold",
							marginLeft: "5px",
							right: "-15%",
						}}
					/>
				</span>
				{/* image */}
				<div className="MoreImage">
					<img
						src={
							consult.professionalImage
								? consult.professionalImage
								: "https://cdn.pixabay.com/photo/2017/04/05/08/28/consulting-2204253_1280.png"
						}
						alt="profile"
					/>
				</div>
			</div>
			<div className="MoreRight">
				<div className="MoreDescription">
					<div className="MoreTitle">
						<i className="fas fa-info-circle"></i>&nbsp;
						<span>Description</span>
					</div>
					<p>{consult.consultDescription}</p>
				</div>
				<div className="MoreDetails">
					<div className="MoreDetailsLeft">
						<Stepper activeStep={activeStep()} alternativeLabel>
							<Step>
								<StepLabel>
									Requested &nbsp;
									{consult.date ? getTimeLabel(new Date(consult.date)) : ""}
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
									Accepted &nbsp;
									{consult.acceptedAt
										? getTimeLabel(new Date(consult.acceptedAt))
										: ""}
								</StepLabel>
							</Step>
							<Step>
								<StepLabel>
									Solved &nbsp;
									{consult.settledAt
										? getTimeLabel(new Date(consult.settledAt))
										: ""}
								</StepLabel>
							</Step>
						</Stepper>
					</div>
					<div className="MoreDetailsRight">
						<div className="MoreProfessional">
							{consult.status === "pending" ? (
								<>
									<i className="fas fa-user-md"></i>&nbsp;
									<span>Not yet accepted</span>
								</>
							) : consult.status === "accepted" ? (
								<>
									<i className="fas fa-user-md"></i>&nbsp;
									<span>Accepted by:</span>&nbsp;
									{consult.acceptedBy}
								</>
							) : (
								<>
									<i className="fas fa-user-md"></i>&nbsp;
									<span>Solved by:</span>&nbsp;
									{consult.professionalName}
								</>
							)}
						</div>
						<div className="MorePrice">
							{consult.status === "accepted" ? (
								<>
									<i className="fas fa-wallet"></i>&nbsp;
									<span>Amount Quoted:</span>&nbsp; KSh.
									{consult?.amountQuoted ? consult.amountQuoted : "0"}
								</>
							) : (
								consult.status === "solved" && (
									<>
										<i className="fas fa-wallet"></i>&nbsp;
										<span>Amount charged:</span>&nbsp; KSh.
										{consult?.amountQuoted ? consult.amountQuoted : "0"}
									</>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsultMore;
