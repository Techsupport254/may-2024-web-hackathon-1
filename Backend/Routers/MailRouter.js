const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();
const { EMAIL, EMAIL_PASSWORD } = process.env;

const sendOrderConfirmationEmail = async (email, order) => {
	const {
		orderId,
		timeline,
		products,
		shipping,
		shippingAddress,
		billingAddress,
		payment,
		amounts,
	} = order;

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
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />
      <title>Order Details</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .Order {
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
        .OrderContainer {
          width: 100%;
          background: #f5f5f5;
          border-radius: 5px;
          margin-bottom: 1rem;
        }
        .OrderRightTop {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .OrderRightTop p,
        .OrderRightTop span {
          color: #666;
        }
        .OrderRightTop a {
          color: #4caf50;
          text-decoration: none;
          font-weight: 600;
        }
        .OrderRightBottom {
          background: #fff;
          border-radius: 5px;
          overflow: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          border: 1px solid #ccc;
          padding: 0.5rem;
          font-size: 0.8rem;
		    vertical-align: top;

        }
        .OrderTotal {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          color: #333;
          margin-top: 1rem;
        }
        .OrderTotal h3 {
          font-size: 0.8rem;
        }
		.OrderTotal span {
          font-size: 0.8rem !important;
        }
        .OrderSummary {
          display: flex;
          flex-direction: column;
          width: 70%;
        }
        .OrderSummary table td,
        .OrderRightTop table td,
        .OrderTotal table td {
          border: none;
		  font-size: 0.8rem !important;
        }
        .OrderSummaryRow {
          display: flex;
          justify-content: space-between;
        }
        .OrderSummaryRow span {
          color: #666;
          font-weight: 500;
        }
        .OrderTotalAmount {
          margin-top: 1rem;
          border-top: 1px solid #ccc;
        }
        .OrderTotalAmount span {
          font-size: 1rem;
          font-weight: 700;
          color: #4caf50;
        }
        .Section {
          margin: 1rem 0;
        }
        .Section table td {
          padding: 0.5rem;
          border: none;
        }
        .Section h3 {
          margin-bottom: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }
        .SectionItem {
          padding: 0.5rem 0;
        }
        .Section p {
          margin: 0;
          color: #333;
        }
        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
        }
        .timeline-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          color: white;
          margin-right: 10px;
        }
		.timeline-item-text p{
			color: #666;
		}
        .timeline-item-title {
          font-weight: 600;
          margin-bottom: 0.2rem;
		  font-size: .9rem;
        }
        .timeline-item-subtitle {
          color: #ccc;
		  font-size: 0.8rem;
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
      <div class="Order">
        <div class="header">
          <img
            src="https://agrisolve-admin.vercel.app/assets/logo-1d4fc32d.png"
            alt="Agrisolve Logo"
          />
          <h1>Agri<span
		  style="font-size: 32px;"
		  >solve</span></h1>
        </div>
        <div class="Greetings">
          <span> Dear Customer, </span>
          <p>
            Your order has been successfully placed. Below are the details of your
            order. In case of any inquiries please contact us on
            <a href="tel:0712345678">0712345678</a>.
          </p>
        </div>
        <div class="OrderContainer">
          <div class="OrderRight">
            <div class="OrderRightTop">
              <table>
                <td>
                  <div>
                    <p>Your Order is</p>
                    <h3>
						${timeline[timeline.length - 1].type}
					</h3>
                    <span>as of 11 June 2024</span>
                  </div>
                </td>
                <td style="text-align: right">
                  <a href="https://agrisolve-admin.vercel.app">View Order</a>
                </td>
              </table>
            </div>
            <div class="OrderRightBottom">
              <table aria-label="simple table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${products
										.map(
											(product, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${product.productName}</td>
                        <td>${product.quantity}</td>
                        <td>KSh. ${product.price.toLocaleString()}</td>
                      </tr>
                    `
										)
										.join("")}
                </tbody>
              </table>
              <div class="OrderTotal">
                <table style="width: 100%; border-collapse: collapse; border: none;">
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <h3>Order Summary</h3>
                    </td>
                    <td><span class="OrderSummaryLabel">Amount:</span></td>
                    <td style="text-align: right">
                      <span class="OrderSummaryValue">KSh. ${amounts.productsAmount.toLocaleString()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><span class="OrderSummaryLabel">Tax:</span></td>
                    <td style="text-align: right">
                      <span class="OrderSummaryValue">KSh. ${amounts.tax.toLocaleString()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><span class="OrderSummaryLabel">Delivery Fee:</span></td>
                    <td style="text-align: right">
                      <span class="OrderSummaryValue">KSh. ${amounts.deliveryFee.toLocaleString()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><span class="OrderSummaryLabel">Discount:</span></td>
                    <td style="text-align: right">
                      <span class="OrderSummaryValue">KSh. ${amounts.discounts.toLocaleString()}</span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr style="color: #007867; font-weight: 600;">
                    <td></td>
                    <td style="border-top: 1px solid #ccc; color: #007867; font-weight: 600;">
                      <span class="OrderSummaryLabel">Total:</span>
                    </td>
                    <td style="text-align: right; border-top: 1px solid #ccc; color: #007867; font-weight: 600;">
                      <span class="OrderSummaryValue">KSh. ${amounts.totalAmount.toLocaleString()}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="OrderLeft">
            <div class="Section">
              <h3>Shipping</h3>
              <div class="SectionItem">
                <table style="width: 100%; border-collapse: collapse">
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Location</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${shippingAddress.location}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Address</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${shippingAddress.street}, ${shippingAddress.city}, ${
		shippingAddress.state
	}, ${shippingAddress.zipCode}, ${shippingAddress.country}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Method</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${shipping.method}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Tracking Number</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${shipping.trackingNumber || "N/A"}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="Section">
              <h3>Billing</h3>
              <div class="SectionItem">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Address</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${billingAddress.street}, ${billingAddress.city}, ${
		billingAddress.state
	}, ${billingAddress.zipCode}, ${billingAddress.country}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="Section">
              <h3>Payment Method</h3>
              <div class="SectionItem">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Method</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${payment.method}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Date</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${new Date(payment.date).toLocaleString()}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Transaction ID</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${payment.transactionId}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Holder</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${payment.holder}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 30%; padding: 0.5rem; font-size: 0.8rem;">
                      <p>Phone</p>
                    </td>
                    <td style="width: 70%; text-align: right; padding: 0.5rem; font-size: 0.8rem;">
                      <p>${payment.number}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="Section">
              <h3>Order Timeline</h3>
              <div class="timeline-item">
                <span class="timeline-dot" style="background-color: green; color: white">
                  <i class="fas fa-check"></i>
                </span>
                <div class="timeline-item-text">
                  <h6 class="timeline-item-title">Delivered</h6>
                  <p class="timeline-item-subtitle">N/A</p>
                </div>
              </div>
              <div class="timeline-item">
                <span class="timeline-dot" style="background-color: rgba(17, 141, 87, 1); color: white">
                  <i class="fas fa-truck"></i>
                </span>
                <div class="timeline-item-text">
                  <h6 class="timeline-item-title">Out for Delivery</h6>
                  <p class="timeline-item-subtitle">N/A</p>
                </div>
              </div>
              ${timeline
								.map(
									(event) => `
                <div class="timeline-item">
                  <span class="timeline-dot" style="background-color: ${
										event.type === "Delivered"
											? "green"
											: event.type === "Out for Delivery"
											? "rgba(17, 141, 87, 1)"
											: event.type === "Confirmed"
											? "purple"
											: "orange"
									}; color: white">
                    <i class="fas fa-${
											event.type === "Delivered" || event.type === "Confirmed"
												? "check"
												: event.type === "Out for Delivery"
												? "truck"
												: "clock"
										}"></i>
                  </span>
                  <div class="timeline-item-text">
                    <h6 class="timeline-item-title">${event.type}</h6>
                    <p class="timeline-item-subtitle">${
											event.type === "Pending"
												? "Default before payment"
												: new Date(event.date).toLocaleString()
										}</p>
                  </div>
                </div>
              `
								)
								.join("")}
				<div class="timeline-item">
                <span class="timeline-dot" style="background-color: orange; color: white">
				  <i class="fas fa-clock"></i>
                </span>
                <div class="timeline-item-text">
                  <h6 class="timeline-item-title">Pending</h6>
                  <p class="timeline-item-subtitle">Default before Payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="Footer">
          <div class="FooterTop">
            <p>
              For any inquiries, please contact us on
              <a href="tel:0712345678">0712345678</a>
            </p>
            <p>Thank you for shopping with us. We hope to see you again soon.</p>
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
		subject: "Order Confirmation",
		html: htmlTemplate,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Order confirmation email sent successfully");
	} catch (error) {
		console.error("Error sending order confirmation email", error);
	}
};

module.exports = { sendOrderConfirmationEmail };
