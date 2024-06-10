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
      <td style="padding: 8px; border: 1px solid #ddd;">${product.productName}</td>
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

module.exports = {
	sendOrderConfirmationEmail,
};
