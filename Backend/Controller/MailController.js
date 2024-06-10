const nodemailer = require("nodemailer");
require("dotenv").config();
const { EMAIL, EMAIL_PASSWORD } = process.env;

// Function to send confirmation email
const sendOrderConfirmationEmail = async (email, products, order) => {
	if (!Array.isArray(products)) {
		throw new Error("Products should be an array");
	}

	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: EMAIL,
			pass: EMAIL_PASSWORD,
		},
	});

	let productRows = products
		.map(
			(product) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${product.productId.productName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${product.quantity}</td>
    </tr>
  `
		)
		.join("");

	let mailOptions = {
		from: EMAIL,
		to: email,
		subject: "Order Confirmation",
		html: `
      <!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Order Confirmation</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background-color: #f9f9f9;
				margin: 0;
				padding: 0;
			}
			.container {
				max-width: 100vw;
				width: auto;
				background-color: #ffffff;
				padding: 1rem;
				border-radius: 8px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			.header {
				text-align: center;
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
			.content {
				padding: 20px 0;
			}
			.content span {
				display: block;
				margin-top: 10px;
				font-size: 16px;
				color: #555;
			}
			.content p {
				font-size: 16px;
				color: #555;
				margin: 10px 0;
			}
			table {
				width: 100%;
				border-collapse: collapse;
				margin-top: 20px;
			}
			table th,
			table td {
				padding: 8px;
				border: 1px solid #ddd;
				text-align: left;
			}
			table th {
				background-color: #f2f2f2;
			}
			.footer {
				margin-top: 20px;
				text-align: left;
			}
			.footer span {
				font-size: 20px;
				font-weight: bold;
				color: #007867;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<img
					src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png"
					alt="Agrisolve Logo"
				/>
				<h1>Agri<span>solve</span></h1>
			</div>
			<div class="content">
				<span><strong>Order ID:</strong> ${order.orderId}</span>
				<span><strong>Order Date:</strong> ${new Date(
					order.createdAt
				).toLocaleString()}</span>
				<span><strong>Order Status:</strong> ${order.status}</span>
				<span><strong>Payment Method:</strong> ${order.payment.method}</span>
				<span><strong>Payment Status:</strong> ${order.payment.status}</span>
				<br />
				<p>Dear Customer,</p>
				<br />
				<h3>Your Order has been placed successfully!</h3>
				<p>
					Thank you for shopping with us. Here are the details of your order:
				</p>
				<table>
					<thead>
						<tr>
							<th>Product Name</th>
							<th>Quantity</th>
						</tr>
					</thead>
					<tbody>
						${productRows}
					</tbody>
				</table>
				<p>We hope to serve you again soon.</p>
				<p>Best Regards,</p>
				<p>Agrisolve Team</p>
				<div class="footer">
					<span>Victor Kirui</span>
				</div>
			</div>
		</div>
	</body>
</html>
    `,
	};

	await transporter.sendMail(mailOptions);
};

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
				pass: EMAIL_PASSWORD,
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
	sendOrderConfirmationEmail,
	sendEmailsToAllUsers,
};
