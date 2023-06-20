import React from "react";
import "./Bank.css";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

const Bank = ({ onClose }) => {
	const [state, setState] = React.useState({
		cvc: "",
		expiry: "",
		focus: "",
		name: "",
		number: "",
	});

	const handleInputFocus = (e) => {
		setState((prevState) => ({ ...prevState, focus: e.target.name }));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		let updatedValue = value;

		// Perform validation based on the input field
		switch (name) {
			case "number":
				updatedValue = value.replace(/\s/g, "").slice(0, 16);
				break;
			case "name":
				updatedValue = value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
				break;
			case "expiry":
				updatedValue = value.replace(/[^0-9/]/g, "").slice(0, 5);
				break;
			case "cvc":
				updatedValue = value.replace(/[^0-9]/g, "").slice(0, 3);
				break;
			default:
				break;
		}

		setState((prevState) => ({ ...prevState, [name]: updatedValue }));
	};

	const saveCard = () => {
		const existingCards = JSON.parse(localStorage.getItem("cards")) || [];
		const updatedCards = [...existingCards, { ...state }];

		localStorage.setItem("cards", JSON.stringify(updatedCards));
		alert("Card saved to local storage!");
		onClose();
	};

	return (
		<div id="PaymentForm">
			<Cards
				cvc={state.cvc}
				expiry={state.expiry}
				focused={state.focus}
				name={state.name}
				number={state.number}
			/>
			<form>
				<input
					type="tel"
					name="number"
					placeholder="Card Number"
					value={state.number}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					required
				/>
				<input
					type="text"
					name="name"
					placeholder="Name"
					value={state.name}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					required
				/>
				<input
					type="tel"
					name="expiry"
					placeholder="MM/YY Expiry"
					value={state.expiry}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					required
				/>
				<input
					type="tel"
					name="cvc"
					placeholder="CVC"
					value={state.cvc}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					required
				/>
				<div className="SaveBtn">
					<button
						onClick={() => {
							saveCard();
						}}
					>
						<i className="fas fa-save"></i>&nbsp; Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default Bank;
