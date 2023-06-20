import React, { useState } from "react";
import "./ProfileAccount.css";

const ProfileAccount = ({ userData, isLoggedin }) => {
	// log user data
	console.log(userData);

	const [edit, setEdit] = useState(true);

	const [accountInfo, setAccountInfo] = useState({
		name: userData?.name || "",
		email: userData?.email || "",
		phone: userData?.phone || "",
		address: userData?.location || "",
		password: "**********",
	});

	const [paymentInfo, setPaymentInfo] = useState({
		cardNumber: userData?.payment?.cardNumber || "",
		cardName: userData?.payment?.cardName || "",
		expiryDate: userData?.payment?.expiryDate || "",
		cvv: userData?.payment?.cvv || "",
	});

	const [shippingInfo, setShippingInfo] = useState({
		name: userData?.shipping?.name || "",
		email: userData?.shipping?.email || "",
		phone: userData?.shipping?.phone || "",
		address: userData?.shipping?.address || "",
	});

	const handleToggleEdit = () => {
		setEdit(!edit);
	};

	const renderAccountInfo = () => {
		return (
			<div className="AccountInfo">
				<h4>Account Information</h4>
				<div className="AccountInfoContainer">
					<div className="AccountInfoItem">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							id="name"
							value={accountInfo.name}
							disabled={edit}
						/>
					</div>
					<div className="AccountInfoItem">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							value={accountInfo.email}
							disabled={edit}
						/>
					</div>
					<div className="AccountInfoItem">
						<label htmlFor="phone">Phone</label>
						<input
							type="text"
							name="phone"
							id="phone"
							value={accountInfo.phone}
							disabled={edit}
						/>
					</div>
					<div className="AccountInfoItem">
						<label htmlFor="address">Address</label>
						<input
							type="text"
							name="address"
							id="address"
							value={accountInfo.address}
							disabled={edit}
						/>
					</div>
					<div className="AccountInfoItem">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							value={accountInfo.password}
							disabled={edit}
						/>
					</div>
					<div className="AccountInfoItem">
						<button className="btn btn-primary" onClick={handleToggleEdit}>
							{edit ? "Edit" : "Save"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderPaymentInfo = () => {
		return (
			<div className="PaymentInfo">
				<h4>Payment Information</h4>
				<div className="PaymentInfoContainer">
					<div className="PaymentInfoItem">
						<label htmlFor="cardNumber">Card Number</label>
						<input
							type="text"
							name="cardNumber"
							id="cardNumber"
							value={paymentInfo.cardNumber}
							disabled={edit}
						/>
					</div>
					<div className="PaymentInfoItem">
						<label htmlFor="cardName">Card Name</label>
						<input
							type="text"
							name="cardName"
							id="cardName"
							value={paymentInfo.cardName}
							disabled={edit}
						/>
					</div>
					<div className="PaymentInfoItem">
						<label htmlFor="expiryDate">Expiry Date</label>
						<input
							type="text"
							name="expiryDate"
							id="expiryDate"
							value={paymentInfo.expiryDate}
							disabled={edit}
						/>
					</div>
					<div className="PaymentInfoItem">
						<label htmlFor="cvv">CVV</label>
						<input
							type="text"
							name="cvv"
							id="cvv"
							value={paymentInfo.cvv}
							disabled={edit}
						/>
					</div>
					<div className="PaymentInfoItem">
						<button className="btn btn-primary" onClick={handleToggleEdit}>
							{edit ? "Edit" : "Save"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	const renderShippingInfo = () => {
		return (
			<div className="ShippingInfo">
				<h4>Shipping Information</h4>
				<div className="ShippingInfoContainer">
					<div className="ShippingInfoItem">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							id="name"
							value={shippingInfo.name}
							disabled={edit}
						/>
					</div>
					<div className="ShippingInfoItem">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							value={shippingInfo.email}
							disabled={edit}
						/>
					</div>
					<div className="ShippingInfoItem">
						<label htmlFor="phone">Phone</label>
						<input
							type="text"
							name="phone"
							id="phone"
							value={shippingInfo.phone}
							disabled={edit}
						/>
					</div>
					<div className="ShippingInfoItem">
						<label htmlFor="address">Address</label>
						<input
							type="text"
							name="address"
							id="address"
							value={shippingInfo.address}
							disabled={edit}
						/>
					</div>
					<div className="ShippingInfoItem">
						<button className="btn btn-primary" onClick={handleToggleEdit}>
							{edit ? "Edit" : "Save"}
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="ProfileAccount">
			{renderAccountInfo()}
			{renderPaymentInfo()}
			{renderShippingInfo()}
		</div>
	);
};

export default ProfileAccount;
