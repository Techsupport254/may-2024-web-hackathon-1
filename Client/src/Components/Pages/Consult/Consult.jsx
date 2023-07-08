import React from "react";
import "./Consult.css";
import ConsultRight from "../../ConsultRight/ConsultRight";
import ConsultLeft from "../../ConsultLeft/ConsultLeft";

const Consult = ({ userData }) => {
	return (
		<div className="Consult">
			<div className="ConsultContainer">
				<div className="ConsultLeft">
					<ConsultLeft userData={userData} />
				</div>
				<div className="ConsultRight">
					<ConsultRight userData={userData} />
				</div>
			</div>
		</div>
	);
};

export default Consult;
