import React from "react";
import "./Consult.css";
import ConsultRight from "../../Components/ConsultRight/ConsultRight";
import ConsultLeft from "../../Components/ConsultLeft/ConsultLeft";

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
