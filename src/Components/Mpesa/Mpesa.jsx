import React, { useState } from "react";
import "./Mpesa.css";
import MpesaImage from "../../assets/m-pesa.png";

const Mpesa = ({ onClose }) => {
	const [name, setName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const saveNumber = () => {
		// Save phone number and name to local storage
		const existingNumbers =
			JSON.parse(localStorage.getItem("AgrisolveNumbers")) || [];
		const updatedNumbers = [
			...existingNumbers,
			{ name, phoneNumber, id: Date.now() },
		];
		localStorage.setItem("AgrisolveNumbers", JSON.stringify(updatedNumbers));

		console.log(updatedNumbers);

		alert("Phone number saved to local storage!");
		onClose();
	};

	return (
		<div className="Mpesa">
			<img
				src={MpesaImage}
				alt="mpesa"
				style={{
					objectFit: "cover",
					marginBottom: "2rem",
				}}
			/>

			<div className="MpesaContainer">
				<div className="MpesaRow">
					<span>Holder Name:</span>
					<input
						type="text"
						placeholder="Enter your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="MpesaRow">
					<span>Phone Number:</span>
					<input
						type="text"
						placeholder="0712345678"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>
				</div>
			</div>
			<div className="MpesaButtons">
				<button onClick={saveNumber}>
					<i className="fas fa-save"></i>&nbsp; Save
				</button>
			</div>
		</div>
	);
};

export default Mpesa;
