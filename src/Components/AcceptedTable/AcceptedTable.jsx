import React, { useState, useEffect } from "react";
import "./AcceptedTable.css";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { Badge } from "@mui/material";
import { Modal } from "antd";
import ConsultChat from "../ConsultChat/ConsultChat";
import axios from "axios";

const AcceptedTable = ({ consults, userData }) => {
	const [selectedConsult, setSelectedConsult] = useState(null);
	const getStatusBadgeColor = (status) => {
		return status === "Pending" ? "success" : "success";
	};

	const handleConsultClick = async (consult) => {
		try {
			setSelectedConsult(consult);
			let selectedId = consult._id;

			await axios.put(`http://localhost:4000/consults/consults/${selectedId}`, {
				newConsult: false,
			});
			console.log("consults: ", selectedId);
			console.log("Consult updated successfully");
		} catch (error) {
			console.error("Error updating consult:", error);
		}
	};

	useEffect(() => {
		console.log("Selected", selectedConsult);
	}, [selectedConsult]);

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

	// Sort the consults array based on the date in descending order
	const sortedConsults = [...consults].sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	);
	console.log("selectedConsult: ", selectedConsult);
	return (
		<div>
			<Table
				sx={{
					margin: "10px",
					padding: "0px",
					boxShadow: "0 0 3px 0px #ccc",
				}}
			>
				<TableHead
					sx={{
						backgroundColor: "#f5f5f5",
						"& .MuiTableCell-root": {
							fontWeight: "bold",
							color: "#000",
							textAlign: "start",
						},
					}}
				>
					<TableRow>
						<TableCell>Consult</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Date Submitted</TableCell>
						<TableCell>Date Settled</TableCell>
						<TableCell>Professional</TableCell>
						<TableCell>Amount Charged</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedConsults.map((consult, index) => (
						<TableRow
							key={index}
							onClick={() => handleConsultClick(consult)}
							className="TableRow"
							sx={{
								"&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" },
								"& .MuiTableCell-root": {},
							}}
						>
							<TableCell
								sx={{
									maxWidth: "150px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",

									"&:hover": {
										overflow: "visible",
										textOverflow: "inherit",
										whiteSpace: "inherit",
									},
								}}
							>
								{consult.subject}
							</TableCell>
							<TableCell>{consult.farmingType}</TableCell>
							<TableCell
								sx={{
									"& .MuiBadge-root": {
										textTransform: "capitalize",
										fontSize: "0.7rem",
										textAlign: "center",
										fontWeight: "bold",
										minWidth: "40%",
									},
								}}
							>
								<Badge
									color={getStatusBadgeColor(consult.status)}
									badgeContent={consult.status}
								/>
							</TableCell>
							<TableCell>
								<span
									style={{
										fontWeight: "bold",
										fontSize: "0.7rem",
										display: "block",
									}}
								>
									{getTimeLabel(new Date(consult.date))}
								</span>
								<p
									style={{
										fontSize: "0.7rem",
										color: "#777",
										margin: "0px",
									}}
								>
									{new Date(consult.date).toLocaleTimeString()}
								</p>
							</TableCell>
							<TableCell>
								<span
									style={{
										fontWeight: "bold",
										fontSize: "0.7rem",
										display: "block",
									}}
								>
									{consult.settledAt
										? new Date(consult.settledAt).toDateString()
										: ""}{" "}
								</span>
								<p
									style={{
										fontSize: "0.7rem",
										color: "#777",
										margin: "0px",
									}}
								>
									{consult.settledAt
										? new Date(consult.settledAt).toLocaleTimeString()
										: ""}
								</p>
							</TableCell>
							<TableCell>{consult.professionalName}</TableCell>
							<TableCell>{consult.amountCharged}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{selectedConsult && (
				<Modal
					open={selectedConsult}
					onCancel={() => setSelectedConsult(null)}
					footer={null}
					width={800}
					centered
				>
					<ConsultChat consult={selectedConsult} userData={userData} />
				</Modal>
			)}
		</div>
	);
};

export default AcceptedTable;
