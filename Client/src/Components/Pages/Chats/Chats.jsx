import React from "react";
import "./Chats.css";
import { TextField } from "@mui/material";

const Chats = () => {
	return (
		<div className="Chats">
			<div className="Header">
				<i className="fas fa-message"></i>
				<h3>Chats</h3>
			</div>
			<div className="ChatContainer">
				<div className="ChatDash">
                    
					<div className="ChatSearch">
						<TextField id="outlined-basic" label="Search" variant="outlined" />
					</div>
				</div>
				<div className="ChatDisplay"></div>
			</div>
		</div>
	);
};

export default Chats;
