import React from "react";
import "./Events.css";
import { useParams } from "react-router-dom";
import { InputAdornment, Switch, TextField } from "@mui/material";

const Events = ({ userData, events }) => {
	const { id } = useParams();
	const [active, setActive] = React.useState(id);
	const event = events?.find((event) => event?._id === id);
	const {
		title,
		date,
		description,
		eventDate,
		from,
		to,
		location,
		address,
		images,
	} = event || {};
	console.log(event);

	// selected image
	const [selectedImage, setSelectedImage] = React.useState(images?.[0]);

	const handleImageClick = (image) => {
		setSelectedImage(image);
	};

	return (
		<div className="Events FlexDisplay">
			<div className="EventsLeft FlexDisplay">
				<div className="Header">
					<i className="fas fa-calendar-alt"></i>
					<h3>Upcoming Events</h3>
				</div>
				<div className="EventsContainer FlexDisplay">
					{events?.map((event) => {
						return (
							<div
								className={`Event FlexDisplay ${
									active === event?._id ? "Active" : ""
								}`}
								key={event?._id}
								onClick={() => {
									window.location.href = `/event/${event?._id}`;
								}}
							>
								<div className="EventHeader FlexDisplay">
									<h3>{event?.title}</h3>
									<p>{event?.date || event?.eventDate}</p>
								</div>
								<div className="EventContainer FlexDisplay">
									<div className="EventLeft">
										<img src={event?.images?.[0]} alt="" />
									</div>
									<div className="EventRight FlexDisplay">
										<p>
											{event?.from}- {event?.to}
										</p>
										<p>{event?.location}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="EventsRight FlexDisplay">
				{!event && (
					<div className="NoEvent FlexDisplay">
						<i className="fas fa-calendar-alt"></i>
						<h3>No Event Selected</h3>
					</div>
				)}
				{event && (
					<div className="ActiveEvent FlexDisplay">
						<div className="ActiveImage ">
							<img src={selectedImage || images?.[0]} alt="" />
							<div className="ActiveImagePreview FlexDisplay">
								{images?.map((image) => {
									return (
										<img
											src={image}
											alt=""
											key={image}
											onClick={() => handleImageClick(image)}
											className={selectedImage === image ? "Active" : ""}
										/>
									);
								})}
							</div>
						</div>
						<div className="ActiveDetails FlexDisplay">
							<div className="ActiveItem FlexDisplay">
								<TextField
									label="Title"
									variant="outlined"
									value={title}
									size="small"
									fullWidth
									disabled
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<TextField
									label="Date"
									variant="outlined"
									value={eventDate}
									size="small"
									type="date"
									fullWidth
									disabled
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</div>
							<div className="ActiveItem FlexDisplay">
								<div className="Switch FlexDisplay">
									<p>Event?</p>
									<Switch
										checked={event?.event === "true"}
										onChange={(e) => {
											console.log(e.target.checked);
										}}
										color="success"
									/>
								</div>
								<TextField
									label="From"
									variant="outlined"
									value={from}
									size="small"
									fullWidth
									disabled
									type="time"
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<TextField
									label="To"
									variant="outlined"
									value={to}
									size="small"
									fullWidth
									disabled
									type="time"
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</div>
							<div className="ActiveItem FlexDisplay">
								<TextField
									label="Location"
									variant="outlined"
									value={location}
									size="small"
									disabled
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<TextField
									label="Address"
									variant="outlined"
									value={address}
									size="small"
									fullWidth
									disabled
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</div>
							<div className="ActiveItem FlexDisplay">
								<TextField
									label="Description"
									variant="outlined"
									value={description}
									size="small"
									fullWidth
									disabled
									multiline
									rows={10}
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</div>
							<div className="ActiveItem FlexDisplay">
								<h3>Fee</h3>
								<TextField
									label="Fee"
									variant="outlined"
									value={event?.fee}
									size="small"
									fullWidth
									disabled
									InputLabelProps={{
										shrink: true,
									}}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">KES</InputAdornment>
										),
									}}
								/>
								<div className="EventButtons FlexDisplay">
									<button className="Book">Book Now</button>
								</div>
							</div>
							<p className="Note">
								<span>Note:</span> The fee mentioned above is for the event
								booking only. Other expenses such as travel and food are not
								included in the fee. Please contact us for more details.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Events;
