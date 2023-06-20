import React from "react";
import "./ConsultLeft.css";
import { AgriproffesionalsData } from "../../Data";
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
	Badge,
} from "@mui/material";

const ConsultLeft = () => (
	<div className="CLeft">
		<h3>Agri-Professionals</h3>
		<div className="CLeftContainer">
			{AgriproffesionalsData.map((item) => (
				<Card className="CLeftCard" key={item.id}>
					<CardActionArea
						className="CLeftCardActionArea"
						onClick={() => window.open(item.link, "_blank")}
					>
						<div className="CLeftCardAction">
							<CardMedia
								className="CLeftCardMedia"
								component="img"
								alt={item.name}
								image={item.image}
							/>
							<CardContent className="CLeftCardContent" sx={{ padding: "0px" }}>
								<div className="CLeftCardText">
									<Typography variant="subtitle1" component="span">
										{item.name}
									</Typography>
									<Typography variant="body2" component="p">
										{item.type}
									</Typography>
								</div>
							</CardContent>
							<div className="CLeftCardStatus">
								<Badge
									className={`CLeftCardBadge ${
										item.active ? "CLeftCardBadgeActive" : ""
									}`}
									variant="dot"
									color={item.active ? "success" : "error"}
									anchorOrigin={{
										vertical: "top",
										horizontal: "center",
									}}
								/>
								{!item.active && (
									<Typography
										variant="body2"
										component="p"
										className="CLeftCardBadgeText"
									>
										{item.lastActive}
									</Typography>
								)}
							</div>
						</div>
					</CardActionArea>
				</Card>
			))}
		</div>
	</div>
);

export default ConsultLeft;
