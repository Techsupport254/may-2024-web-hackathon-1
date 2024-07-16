import React from "react";
import { Timeline } from "antd";
import {
	CheckCircleOutlined,
	FileDoneOutlined,
	DollarOutlined,
	SolutionOutlined,
} from "@ant-design/icons";
import "./SettleConsultation.css";

const SettleConsultation = ({ setIsMoreOpen, consult }) => {
	const formatDateTime = (date) => {
		return new Date(date).toLocaleString("en-US", {
			timeZone: "Africa/Nairobi",
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="SettleConsultation">
			<div className="SettleHeader">
				<h3>Consultation Details</h3>
			</div>
			<div className="SettleBody">
				<span>Subject: {consult?.subject}</span>
				<p>{consult?.consultDescription}</p>
			</div>

			<div className="OrderTimeline">
				<Timeline mode="left">
					<Timeline.Item dot={<FileDoneOutlined />} color="orange">
						<span>Posted</span>
						<p>{consult?.date ? formatDateTime(consult?.date) : "N/A"}</p>
					</Timeline.Item>
					<Timeline.Item dot={<CheckCircleOutlined />} color="blue">
						<span>
							Accepted by <strong>{consult?.acceptedBy}</strong>
						</span>
						<p>
							{consult?.acceptedAt
								? formatDateTime(consult?.acceptedAt)
								: "N/A"}
						</p>
					</Timeline.Item>
					<Timeline.Item dot={<DollarOutlined />} color="red">
						<span>Quoted</span>
						<p>N/A</p>
					</Timeline.Item>
					<Timeline.Item dot={<SolutionOutlined />} color="green">
						<span>Solved</span>
						<p>N/A</p>
					</Timeline.Item>
				</Timeline>
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
