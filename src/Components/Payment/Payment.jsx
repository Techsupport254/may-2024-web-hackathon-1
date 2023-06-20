import React, { useState, useEffect } from "react";
import "./Payment.css";
import { Modal, Button } from "antd";
import "react-credit-cards/es/styles-compiled.css";
import Location from "../Location/Location";
import Bank from "../Bank/Bank";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Payment = ({ handleNext, handleBack, paymentMethod, deliveryMethod }) => {
	const [modal, setModal] = useState(false);
	const [defaultCard, setDefaultCard] = useState(null);
	const [cardLogo, setCardLogo] = useState(null);
	const [modalContent, setModalContent] = useState(null);
	const [defaultLocation, setDefaultLocation] = useState(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
	const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
	const [savedCards, setSavedCards] = useState([]);

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
			setDefaultLocation(locationData);
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
		handleNext();
	};
	return (
		<div className="Payment">
			<div className="BankSection">
				<div className="AccountProfile">
					<div className="TopSec">
						<h3>{paymentMethod ? paymentMethod : ""} details</h3>
						{selectedPaymentMethod !== "cod" && (
							<div className="BankButton">
								<button className="InfoBtn" onClick={() => toggle("bank")}
								>
									<i className="fas fa-plus"></i>
								</button>
							</div>
						)}
					</div>
					{selectedPaymentMethod === "bank" && (
						<div className="Carousel">
							<Carousel
								autoPlay={true}
								showArrows={true}
								showStatus={true}
								showThumbs={false}
								showIndicators={true}cls
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
												id="defaultBank"
												name="defaultBank"
												value="defaultBank"
											/>
										</div>
									</div>
								))}
							</Carousel>
						</div>
					)}
					{paymentMethod === "mpesa" && (
						<>
							<div className="Acc">
								<h5>Default Mpesa number</h5>
								<div className="MpesaAcc">
									<div className="AccImage">
										<i className="fas fa-mobile-alt"></i>
									</div>
									<div className="Mpesa">
										<span>Victor Kirui</span>
										<p>+254 796 851 114</p>
									</div>
								</div>
								<div className="Select">
									<input
										type="radio"
										id="defaultLocation"
										name="defaultLocation"
										value="defaultLocation"
									/>
								</div>
							</div>
						</>
					)}
					{paymentMethod === "paypal" && (
						<>
							<div className="Acc">
								<h5>Default Paypal Account</h5>
								<div className="PaypalAcc">
									<div className="AccImage">
										<i className="fab fa-paypal"></i>
									</div>
									<div className="Paypal">
										<span>Victor Kirui</span>
										<p>kiruivictor097@gmail.com</p>
									</div>
								</div>
								<div className="Select">
									<input
										type="radio"
										id="defaultLocation"
										name="defaultLocation"
										value="defaultLocation"
									/>
								</div>
							</div>
						</>
					)}
					{paymentMethod === "cod" && (
						<>
							<div className="Acc">
								<h5>Cash on Delivery</h5>
								<div className="CodAcc">
									<div className="AccImage">
										<i className="fas fa-money-bill-wave"></i>
									</div>
									<div className="Cod">
										<span>Pay on Delivery</span>
										<p>Pay when order is received successfully</p>
									</div>
								</div>
								<div className="Select">
									<input
										type="radio"
										id="defaultLocation"
										name="defaultLocation"
										value="defaultLocation"
									/>
								</div>
							</div>
						</>
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
							</div>
						)}
					</div>
					{defaultLocation && (
						<div className="Acc">
							{deliveryMethod === "Pick-up" ? (
								<h5>Nearest Pick-Up Location</h5>
							) : (
								<h5>Default Location</h5>
							)}
							<div className="LocationAcc">
								<div className="AccImage">
									<i className="fas fa-map-marker-alt"></i>
								</div>
								<div className="Location">
									<span>{defaultLocation.county}</span>
									<p>{defaultLocation.city}</p>
									<p>{defaultLocation.address}</p>
								</div>
							</div>
							<div className="Select">
								<input
									type="radio"
									id="defaultLocation"
									name="defaultLocation"
									value="defaultLocation"
								/>
							</div>
						</div>
					)}
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
					<Button
						type="primary"
						onClick={handleSaveAndNext}
						disabled={!defaultCard || !defaultLocation}
					>
						Next
					</Button>
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
