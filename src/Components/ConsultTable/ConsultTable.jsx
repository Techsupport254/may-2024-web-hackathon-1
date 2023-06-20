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

const ConsultTable = ({ consults, handleConsultClick }) => {
	const getStatusBadgeColor = (status) => {
		return status === "Pending" ? "primary" : "success";
	};

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
					{consults.map((consult, index) => (
						<TableRow
							key={index}
							onClick={() => handleConsultClick(consult)}
							className="TableRow"
							sx={{
								"&:hover": { backgroundColor: "#f5f5f5", cursor: "pointer" },
							}}
						>
							<TableCell
								sx={{
									maxWidth: "150px",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{consult.title}
							</TableCell>
							<TableCell>{consult.farmType}</TableCell>
							<TableCell>
								<Badge
									color={getStatusBadgeColor(consult.status)}
									badgeContent={consult.status}
								/>
							</TableCell>
							<TableCell>{consult.submittedAt}</TableCell>
							<TableCell>{consult.settledAt}</TableCell>
							<TableCell>{consult.professionalName}</TableCell>
							<TableCell>{consult.amountCharged}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default ConsultTable;
