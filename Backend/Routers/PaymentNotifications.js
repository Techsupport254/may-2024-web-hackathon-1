const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const { EMAIL, EMAIL_PASSWORD } = process.env;

const sendPaymentNotificationEmail = async (email, paymentDetails) => {
	const {
		paymentId,
		amount,
		date,
		status,
		transactionId,
		holder,
		phone,
		customMessage,
	} = paymentDetails;

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: EMAIL,
			pass: EMAIL_PASSWORD,
		},
	});

	const htmlTemplate = `
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Payment Notification</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                .Notification {
                    max-width: 600px;
                    margin: auto;
                    background: #fff;
                    border-radius: 5px;
                    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
                    border: 1px solid #007867;
                    padding: .2rem;
                }
                .header {
                    text-align: center;
                    margin-bottom: 1rem;
                }
                .header img {
                    width: 80px;
                    height: 80px;
                }
                .header h1 {
                    font-size: 32px;
                    margin: 10px 0;
                }
                .header span {
                    color: #007867;
                }
                .Message {
                    margin-bottom: 2rem;
                }
                .Message span {
                    font-weight: 600;
                }
                .Message p {
                    color: #666;
                }
                .Message a {
                    color: #4caf50;
                    text-decoration: none;
                    font-weight: 600;
                }
                .DetailsContainer {
                    width: 100%;
                    background: #f5f5f5;
                    border-radius: 5px;
                    margin-bottom: 1rem;
                }
                .DetailsRight {
                    background: #fff;
                    border-radius: 5px;
                    overflow: auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ccc;
                    padding: 0.5rem;
                    font-size: 0.8rem;
                    vertical-align: top;
                }
                .Footer {
                    width: 100%;
                    background: #fff;
                    border-radius: 5px;
                    margin-top: 1rem;
                }
                .FooterTop {
                    margin-bottom: 1rem;
                }
                .FooterTop p {
                    color: #666;
                }
                .FooterTop span {
                    color: #333;
                    font-weight: 600;
                }
                .FooterTop a {
                    color: #4caf50;
                    text-decoration: none;
                    font-weight: 600;
                }
                .FooterBottom {
                    width: 100%;
                    text-align: center;
                    background: rgba(6, 94, 73, 1);
                    padding: 1rem 0.5rem;
                    border-radius: 5px;
                    color: #fff;
                }
            </style>
        </head>
        <body>
            <div class="Notification">
                <div class="header">
                    <img src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png" alt="Agrisolve Logo" />
                    <h1>Agri<span style="font-size: 32px;">solve</span></h1>
                </div>
                <div class="Message">
                    <span>Dear Customer,</span>
                    <p>${customMessage}</p>
                </div>
                <div class="DetailsContainer">
                    <div class="DetailsRight">
                        <table>
                            <tr>
                                <th>Payment ID</th>
                                <td>${paymentId}</td>
                            </tr>
                            <tr>
                                <th>Amount</th>
                                <td>KSh. ${
																	amount ? amount.toLocaleString() : "N/A"
																}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>${
																	date ? new Date(date).toLocaleString() : "N/A"
																}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>${status}</td>
                            </tr>
                            <tr>
                                <th>Transaction ID</th>
                                <td>${transactionId || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Holder</th>
                                <td>${holder || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>${phone || "N/A"}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="Footer">
                    <div class="FooterTop">
                        <p>For any inquiries, please contact us on <a href="tel:0716404137">0716404137</a></p>
                        <p>Thank you for using our service!</p>
                        <p>Best Regards</p>
                        <span>Victor Kirui</span>
                    </div>
                    <div class="FooterBottom">
                        <p>&copy; 2024 Agrisolve. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `;

	let mailOptions = {
		from: EMAIL,
		to: email,
		subject: status,
		html: htmlTemplate,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Payment notification email sent successfully");
	} catch (error) {
		console.error("Error sending payment notification email", error);
	}
};

module.exports = { sendPaymentNotificationEmail };
