import React, { useState } from "react";

const Paypal = ({ onClose }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [success, setSuccess] = useState(false);

	const savePypl = () => {
		// Save email and name to local storage
		const existingPaypal =
			JSON.parse(localStorage.getItem("AgrisolvePaypal")) || [];
		const updatedPaypal = [...existingPaypal, { name, email, id: Date.now() }];
		localStorage.setItem("AgrisolvePaypal", JSON.stringify(updatedPaypal));

		console.log(updatedPaypal);

		setSuccess(true);
		setTimeout(() => {
			setSuccess(false);
			onClose();
		}, 2000);
	};

	return (
		<div className="Paypal">
			<table border="0" cellpadding="10" cellspacing="0" align="center">
				<tr>
					<td align="center"></td>
				</tr>
				<tr>
					<td align="center">
						<a
							href="https://www.paypal.com/webapps/mpp/paypal-popup"
							title="How PayPal Works"
							onclick="javascript:window.open('https://www.paypal.com/webapps/mpp/paypal-popup','WIPaypal','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1060, height=700'); return false;"
						>
							<img
								src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg"
								border="0"
								alt="PayPal Acceptance Mark"
							/>
						</a>
					</td>
				</tr>
			</table>
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
					<span>Email:</span>
					<input
						type="text"
						placeholder="example@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				{success && (
					<div className="SuccessMessage">Email saved successfully!</div>
				)}
			</div>
			<div className="MpesaButtons">
				<button onClick={savePypl}>
					<i className="fas fa-save"></i>&nbsp; Save
				</button>
			</div>
		</div>
	);
};

export default Paypal;
