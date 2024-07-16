require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Token = require("./Routers/TokenRouter");
const userRouter = require("./Routers/userRouter");
const paymentRouter = require("./Routers/paymentRouter");
const consultRouter = require("./Routers/consultRouter");
const chatRouter = require("./Routers/chatRouter");
const productRouter = require("./Routers/ProductRoute");
const newsRouter = require("./Routers/NewsRouter");
const cartRouter = require("./Routers/cartRouter");
const orderRouter = require("./Routers/OrderRouter");
const earningsRouter = require("./Routers/EarningsRouter");
const searchRouter = require("./Routers/SearchRouter");

// Set up server
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Set up CORS to allow specific origins with credentials
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:5174",
	"https://b75e-41-90-234-185.ngrok-free.app",
	"https://agrisolveclient-techsupport254s-projects.vercel.app",
];

app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				const msg =
					"The CORS policy for this site does not allow access from the specified origin.";
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connection established");

		// Set up routes
		app.get("/", (req, res) => res.send("API running"));
		app.use("/auth", userRouter);
		app.use("/payment", paymentRouter);
		app.use("/tokens", Token);
		app.use("/consults", consultRouter);
		app.use("/chats", chatRouter);
		app.use("/products", productRouter);
		app.use("/news", newsRouter);
		app.use("/cart", cartRouter);
		app.use("/order", orderRouter);
		app.use("/earnings", earningsRouter);
		app.use("/search", searchRouter); // Add search router

		// Start the server
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1); // Exit the process if MongoDB connection fails
	});

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
	process.exit(1); // Exit the process after handling uncaught exception
});

// Error handling for unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Promise Rejection:", err);
	process.exit(1); // Exit the process after handling unhandled promise rejection
});
