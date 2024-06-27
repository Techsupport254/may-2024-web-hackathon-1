import React, { useContext, useState } from "react";
import "./Consult.css";
import ConsultRight from "../../Components/ConsultRight/ConsultRight";
import ConsultLeft from "../../Components/ConsultLeft/ConsultLeft";
import { ApiContext } from "../../Context/ApiProvider";
import { motion } from "framer-motion";

const Consult = () => {
	const { userData } = useContext(ApiContext);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="Consult">
			<div
				className={`ConsultContainer ${
					isSidebarOpen ? "sidebar-open" : "sidebar-closed"
				}`}
			>
				<motion.div
					className="ConsultLeft"
					initial={{ x: -400 }}
					animate={{ x: isSidebarOpen ? 0 : -400 }}
					transition={{ type: "spring", stiffness: 100 }}
				>
					<ConsultLeft userData={userData} />
				</motion.div>
				<div className="ConsultRight">
					<ConsultRight userData={userData} toggleSidebar={toggleSidebar} />
				</div>
			</div>
		</div>
	);
};

export default Consult;
