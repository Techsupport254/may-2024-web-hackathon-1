const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../env");
const User = require("../Models/UserModel");

// Email sending function
const sendEmailsToAllUsers = async (req, res) => {
	try {
		// Fetch all users
		const users = await User.find({});

		if (users.length === 0) {
			return res.status(404).json({ msg: "No users found" });
		}

		let config = {
			service: "gmail",
			auth: {
				user: EMAIL,
				pass: PASSWORD,
			},
		};

		let transporter = nodemailer.createTransport(config);

		let emailPromises = users.map((user) => {
			let message = {
				from: EMAIL,
				to: user.email,
				subject: "Welcome to Agrisolve!",
				html: `
					<!DOCTYPE html>
					<html lang="en">
						<head>
							<meta charset="UTF-8" />
							<meta name="viewport" content="width=device-width, initial-scale=1.0" />
							<title>Welcome to Agrisolve</title>
							<style>
								body {
									background-color: #f9f9f9;
									font-family: Arial, sans-serif;
								}
								.container {
									width: 100%;
									max-width: 600px;
									margin: 0 auto;
									background-color: #ffffff;
									padding: 20px;
									border-radius: 8px;
									box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
								}
								.header {
									display: flex;
									justify-content: center;
									align-items: center;
									text-align: center;
									gap: 10px;
									padding-bottom: 20px;
									border-bottom: 1px solid #e0e0e0;
								}
								.logo img {
									width: 80px;
									height: 80px;
								}
								.title {
									font-size: 32px;
									margin-top: 10px;
									font-weight: bold;
								}
								.title span {
									color: #007867;
								}
								.content {
									padding: 20px 0;
								}
								.content h3 {
									font-size: 15px;
									color: #333333;
								}
								.content p {
									font-size: 16px;
									color: #555555;
									line-height: 1.5;
									margin: 10px 0;
								}
								.footer {
									padding-top: 8px;
									border-top: 1px solid #e0e0e0;
								}
								.footer p {
									font-size: 16px;
									color: #555555;
								}
								.footer span {
									color: #007867;
									font-weight: bold;
								}
							</style>
						</head>
						<body>
							<div class="container">
								<div class="header">
									<div class="logo">
										<img src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png" alt="Agrisolve Logo" />
									</div>
									<div class="title">Agri<span>solve</span></div>
								</div>
								<div class="content">
									<h3>Welcome to Agrisolve!</h3>
									<h3>Hi there, ${user.name}</h3>
									<p>
										We are thrilled to have you with us. At Agrisolve, we provide a wide range of services designed to support and enhance agricultural practices.
									</p>
									<p>
										Our services include agrovet e-commerce for all your agricultural supplies, expert consultation services for tailored advice, and the ability to request specialists for on-site support. We are dedicated to helping you achieve success in your agricultural endeavors.
									</p>
								</div>
								<div class="footer">
									<p>Best Regards,</p>
									<p>Agrisolve Team</p>
									<span>Victor Kirui</span>
								</div>
							</div>
						</body>
					</html>
				`,
			};

			return transporter.sendMail(message);
		});

		// Send all emails
		await Promise.all(emailPromises);

		return res.status(201).json({
			msg: "Emails sent successfully to all users!",
		});
	} catch (error) {
		return res.status(500).json({ error });
	}
};

module.exports = {
	sendEmailsToAllUsers,
};
