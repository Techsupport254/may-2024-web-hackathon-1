import React from "react";
import "./Notifications.css";

const Notifications = () => {
	const [Notifications, setNotifications] = React.useState([
		{
			id: 1,
			title: "Notification 1",
			description: "Notification 1 Description",
			date: "12/12/2020",
		},
		{
			id: 2,
			title: "Notification 2",
			description: "Notification 2 Description",
			date: "12/12/2020",
		},
		{
			id: 3,
			title: "Notification 3",
			description: "Notification 3 Description",
			date: "12/12/2020",
		},
		{
			id: 4,
			title: "Notification 4",
			description: "Notification 4 Description",
			date: "12/12/2020",
		},
		{
			id: 5,
			title: "Notification 5",
			description: "Notification 5 Description",
			date: "12/12/2020",
		},
		{
			id: 6,
			title: "Notification 6",
			description: "Notification 6 Description",
			date: "12/12/2020",
		},
		{
			id: 7,
			title: "Notification 7",
			description: "Notification 7 Description",
			date: "12/12/2020",
		},
	]);
	return (
		<div className="Notifications">
			<h3>Notifications ({Notifications.length})</h3>
			<div className="NotificationsContainer">
				{Notifications.map((notification, id) => (
					<div className="Notification" key={id}>
						<div className="NotificationBody">
							<h4>{notification.title}</h4>
							<p>{notification.description}</p>
						</div>
						<div className="NotificationFooter">
							<p>{notification.date}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Notifications;
