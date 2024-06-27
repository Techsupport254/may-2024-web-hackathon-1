import React from "react";
import "./SettleConsultation.css";

const SettleConsultation = ({ setIsMoreOpen, consult }) => {
	return (
		<div className="SettleConsultation">
			<div className="SettleHeader">
				<h3>Consultation Details</h3>
				<p>
					Posted on {new Date(consult?.date).toLocaleDateString()} at{" "}
					{new Date(consult?.date).toLocaleTimeString()}
				</p>
				<p>
					Accepted by: <strong>{consult?.acceptedBy}</strong> on{" "}
					{new Date(consult?.acceptedAt).toLocaleString("en-US", {
						timeZone: "Africa/Nairobi",
					})}
				</p>
			</div>
			<div className="SettleBody">
				<span>Subject: {consult?.subject}</span>
				<p>{consult?.consultDescription}</p>
			</div>
			<div className="AmountCharged">
				<span>Amount Charged:</span>
				<p>
					<strong>KSh. 1000</strong>
				</p>
			</div>
			<div className="SettleFooter">
				<button className="SettleButton" onClick={() => setIsMoreOpen(false)}>
					Approve
					<i className="fas fa-check"></i>
				</button>
			</div>
		</div>
	);
};

export default SettleConsultation;
