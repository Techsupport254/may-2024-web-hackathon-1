import React, { useState, useEffect } from "react";
import "./Payment.css";
import { Modal, Button } from "antd";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Location from "../Location/Location";
import Bank from "../Bank/Bank";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Mpesa from "../Mpesa/Mpesa";
import Paypal from "../Paypal/Paypal";

const Payment = ({ handleNext, handleBack, paymentMethod, deliveryMethod }) => {
	const [modal, setModal] = useState(false);
	const [defaultCard, setDefaultCard] = useState(null);
	const [cardLogo, setCardLogo] = useState(null);
	const [modalContent, setModalContent] = useState(null);
	const [defaultLocation, setDefaultLocation] = useState(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
	const [savedCards, setSavedCards] = useState([]);
	const [defaultNumber, setDefaultNumber] = useState(null);
	const [savedNumbers, setSavedNumbers] = useState([]);
	const [savedPaypal, setSavedPaypal] = useState([]);
	const [defaultPaypal, setDefaultPaypal] = useState(null);
	const [isAccountSelected, setIsAccountSelected] = useState(false);
	const [isLocationSelected, setIsLocationSelected] = useState(false);
	const [savedLocation, setSavedLocation] = useState([]);
	const [selectedPayment, setSelectedPayment] = useState(null);
	const [error, setError] = useState(null);

	const toggle = (componentType) => {
		setModal(!modal);
		setModalContent(componentType);
	};

	const closeModal = () => {
		setModal(false);
	};

	// Set payment and delivery methods
	useEffect(() => {
		if (paymentMethod && deliveryMethod) {
			setSelectedPaymentMethod(paymentMethod);
			setSelectedDeliveryMethod(deliveryMethod);
		}
	}, [paymentMethod, deliveryMethod]);

	useEffect(() => {
		// Fetch the saved cards from local storage
		const savedCards = localStorage.getItem("cards");
		if (savedCards) {
			const cardData = JSON.parse(savedCards);
			setDefaultCard(cardData[0]);
			fetchCardLogo(cardData[0].number);
			setSavedCards(cardData); // Optional: Store all the saved cards in state
		}

		// Fetch the saved location from local storage
		const savedLocation = localStorage.getItem("locationData");
		if (savedLocation) {
			const locationData = JSON.parse(savedLocation);
			if (Array.isArray(locationData)) {
				setDefaultLocation(locationData[0]);
				setSavedLocation(locationData);
			}
		}

		// fetch saved numbers from local storage
		const savedNumbers = localStorage.getItem("AgrisolveNumbers");
		if (savedNumbers) {
			const numberData = JSON.parse(savedNumbers);
			setDefaultNumber(numberData[0]);
			setSavedNumbers(numberData);
		}
		// fetch saved paypal from local storage
		const savedPaypal = localStorage.getItem("AgrisolvePaypal");
		if (savedPaypal) {
			const paypalData = JSON.parse(savedPaypal);
			setDefaultPaypal(paypalData[0]);
			setSavedPaypal(paypalData);
		}
	}, []);

	const fetchCardLogo = (cardNumber) => {
		// Get the first 6 digits of the card number
		const cardPrefix = cardNumber.substring(0, 6);
		// Fetch the card logo from the binlist API
		fetch(`https://lookup.binlist.net/${cardPrefix}`)
			.then((res) => res.json())
			.then((data) => {
				// Get the card logo URL from the response
				const cardLogoUrl =
					data.scheme === "visa"
						? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png"
						: data.scheme === "mastercard"
						? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png"
						: data.brand_logo; // Use the brand logo provided by the API as a fallback
				// Set the card logo URL to state
				setCardLogo(cardLogoUrl);
			})
			.catch((err) => console.log(err));
	};

	const maskCardNumber = (cardNumber) => {
		const cardNumberLength = cardNumber.length;
		const maskedNumber = cardNumber.replace(
			cardNumber.substring(4, cardNumberLength - 4),
			"*".repeat(cardNumberLength - 8)
		);

		return maskedNumber;
	};

	const handleSaveAndNext = () => {
		let selectedAccount;
		let selectedLocation;
		let selectedPayment = paymentMethod;

		if (
			isAccountSelected &&
			isLocationSelected &&
			(paymentMethod !== "cod" || deliveryMethod !== "Pick-up")
		) {
			switch (selectedPaymentMethod) {
				case "bank":
					selectedAccount = savedCards.find(
						(card) => card.id === defaultCard.id
					);
					break;
				case "mpesa":
					selectedAccount = savedNumbers.find(
						(number) => number.id === defaultNumber.id
					);
					break;
				case "paypal":
					selectedAccount = savedPaypal.find(
						(paypal) => paypal.id === defaultPaypal.id
					);
					break;
				default:
					break;
			}

			selectedLocation = savedLocation.find(
				(loc) => loc.id === defaultLocation.id
			);

			localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));
			localStorage.setItem(
				"selectedLocation",
				JSON.stringify(selectedLocation)
			);

			handleNext(selectedAccount, selectedLocation);
		} else {
			setError("Please select an account, location and payment method");
			setTimeout(() => {
				setError(null);
			}, 2000);
		}
	};

	const handleReload = () => {
		// reload the data from local storage
		const savedCards = localStorage.getItem("cards");
		if (savedCards) {
			const cardData = JSON.parse(savedCards);
			setDefaultCard(cardData[0]);
			fetchCardLogo(cardData[0].number);
			setSavedCards(cardData); // Optional: Store all the saved cards in state
		}

		// Fetch the saved location from local storage
		const savedLocation = localStorage.getItem("locationData");
		if (savedLocation) {
			const locationData = JSON.parse(savedLocation);
			setDefaultLocation(locationData);
			setSavedLocation(locationData);
		}
		// fetch saved numbers from local storage
		const savedNumbers = localStorage.getItem("AgrisolveNumbers");
		if (savedNumbers) {
			const numberData = JSON.parse(savedNumbers);
			setDefaultNumber(numberData[0]);
			setIsAccountSelected(numberData[0]);
			setSavedNumbers(numberData);
		}
		// fetch saved paypal from local storage
		const savedPaypal = localStorage.getItem("AgrisolvePaypal");
		if (savedPaypal) {
			const paypalData = JSON.parse(savedPaypal);
			setDefaultPaypal(paypalData[0]);
			setIsAccountSelected(paypalData[0]);
			setSavedPaypal(paypalData);
		}
	};

	const handleSelectAccount = (cardId) => {
		if (paymentMethod === "bank") {
			setDefaultCard(savedCards.find((card) => card.id === cardId));
		} else if (paymentMethod === "mpesa") {
			setDefaultNumber(savedNumbers.find((number) => number.id === cardId));
		} else if (paymentMethod === "paypal") {
			setDefaultPaypal(savedPaypal.find((paypal) => paypal.id === cardId));
		}

		setIsAccountSelected(true);
	};

	const handleSelectLocation = (location) => {
		setDefaultLocation(savedLocation.find((loc) => loc.id === location.id));
		setIsLocationSelected(true);
	};

	useEffect(() => {
		console.log(
			isAccountSelected,
			isLocationSelected,
			paymentMethod,
			deliveryMethod
		);
	}, [isAccountSelected, isLocationSelected, paymentMethod, deliveryMethod]);

	if (
		isAccountSelected &&
		(paymentMethod === "bank" ||
			paymentMethod === "mpesa" ||
			paymentMethod === "paypal")
	) {
		let selectedAccount;

		switch (paymentMethod) {
			case "bank":
				selectedAccount = savedCards.find((card) => card.id === defaultCard.id);
				break;
			case "mpesa":
				selectedAccount = savedNumbers.find(
					(number) => number.id === defaultNumber.id
				);
				break;
			case "paypal":
				selectedAccount = savedPaypal.find(
					(paypal) => paypal.id === defaultPaypal.id
				);
				break;
			default:
				break;
		}

		console.log(paymentMethod, selectedAccount);

		// save the selected account to local storage and paymentMethod
		localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));
		localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
	} else {
		// todo: remove the selected account from local storage
	}

	// fetch the selected delivery location
	if (isLocationSelected === true && deliveryMethod !== "pickup") {
		const selectedLocation = savedLocation.find(
			(loc) => loc.id === defaultLocation.id
		);

		// save the selected location to local storage
		localStorage.setItem("selectedLocation", JSON.stringify(selectedLocation));
		localStorage.setItem("deliveryMethod", JSON.stringify(deliveryMethod));
	}

	return (
		<div className="Payment">
			{error && (
				<p
					className="Error"
					style={{
						color: "red",
						fontSize: ".7rem",
					}}
				>
					{error}
				</p>
			)}
			<div className="BankSection">
				<div className="AccountProfile">
					<div className="TopSec">
						<h3>{paymentMethod ? paymentMethod : ""} details</h3>
						{selectedPaymentMethod !== "cod" && (
							<div className="BankButton">
								<button
									className="InfoBtn"
									onClick={() => toggle(selectedPaymentMethod)}
								>
									<i className="fas fa-plus"></i>
								</button>
								<button className="InfoBtn" onClick={handleReload}>
									<i className="fas fa-sync-alt"></i>
								</button>
							</div>
						)}
					</div>
					{selectedPaymentMethod === "bank" && (
						<div className="Carousel">
							<Carousel
								autoPlay={true}
								showArrows={false}
								showStatus={true}
								showThumbs={false}
								showIndicators={true}
								cls
								onChange={() => {}}
								className="CarouselContainer"
							>
								{savedCards.map((card) => (
									<div className="Acc" key={card.number}>
										<h5>Default Bank</h5>
										<div className="BankAcc">
											<div className="AccImage">
												<img src={cardLogo} alt="Bank Logo" />
											</div>
											<div className="AccountName">
												<span>{card.name}</span>
												<p>
													{card.number
														? maskCardNumber(card.number)
														: "No card saved"}
												</p>
											</div>
										</div>
										<div className="Select">
											<input
												type="radio"
												id={card.id}
												name="defaultBank"
												value={card.id}
												onChange={() => handleSelectAccount(card.id)}
											/>
										</div>
									</div>
								))}
							</Carousel>
						</div>
					)}
					{paymentMethod === "mpesa" && (
						<div className="Carousel">
							<Carousel
								autoPlay={true}
								showArrows={false}
								showStatus={true}
								showThumbs={false}
								showIndicators={true}
								onChange={() => {}}
								className="CarouselContainer"
							>
								{savedNumbers?.map((number) => (
									<div className="Acc" key={number.id}>
										<h5>Default Mpesa Number</h5>
										<div className="MpesaAcc">
											<div className="AccImage">
												<i className="fas fa-mobile-alt"></i>
											</div>
											<div className="Mpesa">
												<span>{number.name}</span>
												<p>{number.phoneNumber}</p>
											</div>
										</div>
										<div className="Select">
											<input
												type="radio"
												id={number.id}
												name="defaultMpesa"
												value="defaultMpesa"
												onChange={() => handleSelectAccount(number.id)}
											/>
										</div>
									</div>
								))}
							</Carousel>
						</div>
					)}
					{paymentMethod === "paypal" && (
						<div className="Carousel">
							<Carousel
								autoPlay={true}
								showArrows={false}
								showStatus={true}
								showThumbs={false}
								showIndicators={true}
								onChange={() => {}}
								className="CarouselContainer"
							>
								{savedPaypal?.map((pal) => (
									<div className="Acc" key={pal.id}>
										<h5>Default Paypal Account</h5>
										<div className="PaypalAcc">
											<div className="AccImage">
												<i className="fab fa-paypal"></i>
											</div>
											<div className="Mpesa">
												<span>{pal.name}</span>
												<p>{pal.email}</p>
											</div>
										</div>
										<div className="Select">
											<input
												type="radio"
												id={pal.id}
												name="defaultPaypal"
												value="defaultPaypal"
												onChange={() => handleSelectAccount(pal.id)}
											/>
										</div>
									</div>
								))}
							</Carousel>
						</div>
					)}
				</div>
			</div>

			<div className="DeliverySection">
				<div className="DeliveryProfile">
					<div className="TopSec">
						<h3>
							{deliveryMethod === "Pick-up" ? "Pick-up" : "Delivery"} Location
						</h3>
						{deliveryMethod !== "Pick-up" && (
							<div className="DeliveryButton">
								<button className="InfoBtn" onClick={() => toggle("location")}>
									<i className="fas fa-plus"></i>
								</button>
								<button className="InfoBtn" onClick={handleReload}>
									<i className="fas fa-sync-alt"></i>
								</button>
							</div>
						)}
					</div>
					<div className="Carousel">
						<Carousel
							autoPlay={true}
							showArrows={false}
							showStatus={true}
							showThumbs={false}
							showIndicators={true}
							onChange={() => {}}
							className="CarouselContainer"
						>
							{savedLocation?.map((location) => (
								<div className="Acc" key={location.id}>
									<h5>Default Location</h5>
									<div className="LocationAcc">
										<div className="AccImage">
											<i className="fas fa-map-marker-alt"></i>
										</div>
										<div className="Location">
											<span>
												{location.city} {location.county}
											</span>
											<p>
												{location.postalCode}, {location.address},{" "}
												{location.nearestPostOffice}
											</p>
										</div>
									</div>
									<div className="Select">
										<input
											type="radio"
											id={location.id}
											name="defaultLocation"
											value="defaultLocation"
											onChange={() => handleSelectLocation(location)}
										/>
									</div>
								</div>
							))}
						</Carousel>
					</div>
				</div>
				<div
					className="Buttons"
					style={{
						display: "flex",
						justifyContent: "space-between",
						marginTop: "20px",
					}}
				>
					<Button type="default" onClick={handleBack}>
						Back
					</Button>
					{deliveryMethod !== "Pick-up" && paymentMethod !== "cod" ? (
						<Button
							type="primary"
							onClick={handleSaveAndNext}
							disabled={!isAccountSelected || !isLocationSelected}
						>
							Next
						</Button>
					) : (
						<Button
							type="primary"
							onClick={handleSaveAndNext}
							disabled={!isLocationSelected}
						>
							Next
						</Button>
					)}
				</div>
			</div>

			{modal && (
				<Modal
					open={modal}
					onCancel={closeModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					centered={true}
					wrapClassName="BankModal"
					footer={null}
					width={400}
				>
					<div className="Modal">
						{modalContent === "bank" && <Bank onClose={closeModal} />}
						{modalContent === "location" && <Location onClose={closeModal} />}
						{modalContent === "mpesa" && <Mpesa onClose={closeModal} />}
						{modalContent === "paypal" && <Paypal onClose={closeModal} />}
					</div>
				</Modal>
			)}
		</div>
	);
};

export default Payment;
