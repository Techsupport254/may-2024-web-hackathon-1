import React from "react";
import "./ConsultMore.css";

const ConsultMore = ({ userData, consult }) => {
	console.log(consult);
	return (
		<div className="ConsultMore">
			<h5>{consult.subject}</h5>
			<p>
				<strong>Consultant:</strong>{" "}
				{consult.professionalName
					? consult.professionalName
					: "Not yet assigned/accepted"}
			</p>
			<p>
				<strong>Description:</strong> {consult.consultDescription}
			</p>
		</div>
	);
};

export default ConsultMore;
