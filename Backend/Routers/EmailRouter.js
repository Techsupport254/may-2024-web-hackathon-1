const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const { EMAIL, EMAIL_PASSWORD, FRONTEND_URL } = process.env;

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: EMAIL,
		pass: EMAIL_PASSWORD,
	},
});

const sendVerificationEmail = async (email, verificationCode, codeExpiry) => {
	// Ensure codeExpiry is a valid ISO string
	const expiryDate = new Date(codeExpiry);

	const verificationLink = `${FRONTEND_URL}/verify?code=${verificationCode}`;
	const emailSubject = "Verify Your Email Address";

	const htmlTemplate = `
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
                integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
                crossorigin="anonymous"
                referrerpolicy="no-referrer"
            />
            <title>Verify Your Email</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                .Email {
                    max-width: 600px;
                    margin: auto;
                    background: #fff;
                    border-radius: 5px;
                    box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
                    border: 1px solid #007867;
                    padding: 0.2rem;
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
                .Greetings {
                    margin-bottom: 2rem;
                }
                .Greetings span {
                    font-weight: 600;
                }
                .Greetings p {
                    color: #666;
                }
                .Greetings a {
                    color: #4caf50;
                    text-decoration: none;
                    font-weight: 600;
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
            <div class="Email">
                <div class="header">
                    <img
                        src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png"
                        alt="Agrisolve Logo"
                    />
                    <h1>Agri<span style="font-size: 32px">solve</span></h1>
                </div>
                <div class="Greetings">
                    <span>Dear Customer,</span>
                    <p>Please click the button below to verify your email address.</p>
                    <button
                        style="
                            background: rgba(6, 94, 73, 1);
                            color: white;
                            padding: 0.5rem 1rem;
                            margin: 1rem 0;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                        "
                    >
                        <a
                            href="${verificationLink}"
                            style="color: white; text-decoration: none"
                            >Verify Email</a
                        >
                    </button>
                    <p>
                        Or copy and paste the link below in your browser:
                        <br />
                        ${verificationLink}
                    </p>
                    <p>
                        Your verification code will expire on ${expiryDate.toLocaleString()}.
                    </p>
                    <p>
                        Please note that this link will expire in 1 hour.<br />
                        If you did not request this verification, please ignore this email.
                    </p>
                </div>
                <div class="Footer">
                    <div class="FooterTop">
                        <p>
                            For any inquiries, please contact us on
                            <a href="tel:0716404137">0716404137</a>
                        </p>
                        <span>Thank you for choosing Agrisolve</span>
                        <p>
                            <a href="https://agrisolve-admin.vercel.app">Agrisolve</a>
                        </p>
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
		subject: emailSubject,
		html: htmlTemplate,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Verification email sent successfully");
	} catch (error) {
		console.error("Error sending verification email", error);
	}
};

module.exports = { sendVerificationEmail };
