import React from "react";
import "./Forgot.css";
import { Link } from "@mui/material";

const Forgot = () => {
	return (
		<div className="Forgot">
			<div className="ForgotContainer">
				<div className="ForgotLeft">
					<div className="ForgotLeftCont">
						<h3>Forgot your password?</h3>
					</div>
				</div>

				<div className="ForgotRight">
					<p>
						Back to{" "}
						<span>
							<Link to="/login">Login</Link>
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Forgot;
