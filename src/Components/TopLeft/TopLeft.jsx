import React, { useState } from "react";
import "./TopLeft.css";
import { AgribusinessData } from "../../Data";
import { motion } from "framer-motion";

const TopLeft = () => {
	const [active, setActive] = useState(null);

	const closeModal = () => {
		setActive(null);
	};

	return (
		<div className="TopLeft">
			<h3>Agribusinesses/Agrovets</h3>
			{AgribusinessData.map((item) => {
				return (
					<motion.div
						className={`TopLeftItem ${active === item.id ? "active" : ""}`}
						layout
						onClick={() => setActive(item.id)}
						key={item.id}
					>
						<motion.div layout className="Image">
							<img src={item.image} alt={item.name} />
						</motion.div>
						<motion.div layout className="Title">
							<span>{item.name}</span>
							<span>{item.location}</span>
						</motion.div>
						<motion.div className="Icon">
							{active === item.id ? (
								<i className="fas fa-caret-up"></i>
							) : (
								<i className="fas fa-caret-down"></i>
							)}
						</motion.div>
					</motion.div>
				);
			})}
			{active && (
				<div className="LeftModal">
					<div className="LeftModalContent">
						<img
							src={AgribusinessData[active - 1].image}
							alt={AgribusinessData[active - 1].name}
						/>
						<h4>{AgribusinessData[active - 1].name}</h4>
						<h5>{AgribusinessData[active - 1].location}</h5>
						<p>{AgribusinessData[active - 1].description}</p>
						<button onClick={closeModal}>Close</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TopLeft;
