import React from "react";
import "./ConsultTable.css";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { Badge } from "@mui/material";

const ConsultTable = ({ userData, consults, handleConsultClick }) => {
	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "pending":
				return "error";
			case "accepted":
				return "warning";
			case "solved":
				return "success";
			case "quoted":
				return "info";
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

	// Sort the consults array based on the date in descending order
	const sortedConsults = [...consults].sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	);

	// filter the sortedConsults array based on refId
	const filteredConsults = sortedConsults.filter(
		(consult) => consult.refId === userData._id
	);

	return (
		<div className="ConsultsTable">
			{filteredConsults.length === 0 ? (
				<div className="EmptyTable">
					<i className="fas fa-info-circle"></i>&nbsp;{" "}
					<p> No data to be displayed here</p>
				</div>
			) : (
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
						{filteredConsults.map((consult, index) => (
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
										badgeContent={consult?.status}
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
										{
											new Date(consult.date).toLocaleTimeString() // Display the time
										}
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
											? getTimeLabel(new Date(consult.settledAt))
											: "Not Settled Yet"}
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
								<TableCell>
									{consult?.acceptedBy ? consult?.acceptedBy : "N/A"}
								</TableCell>
								<TableCell>
									{consult.amountCharged ? consult.amountCharged : "N/A"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
};

export default ConsultTable;
