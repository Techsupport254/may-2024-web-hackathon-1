import React from "react";
import "./Consult.css";
import ConsultRight from "../../ConsultRight/ConsultRight";
import ConsultLeft from "../../ConsultLeft/ConsultLeft";

const Consult = () => {
	return (
		<div className="Consult">
			<div className="ConsultContainer">
				<div className="ConsultLeft">
					<ConsultLeft />
				</div>
				<div className="ConsultRight">
					<ConsultRight />
				</div>
			</div>
		</div>
	);
};

export default Consult;
