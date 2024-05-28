require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Token = require("./Routers/TokenRouter");

// Set up server
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());

// Set up CORS to allow all origins with credentials
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);

app.use(cookieParser());

// Connect to MongoDB using promises
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connection established");

		app.get("/", (req, res) => res.send("API running"));

		// Set up routes after the database connection is established
		app.use("/auth", require("./Routers/userRouter"));
		app.use("/payment", require("./Routers/paymentRouter"));
		app.use("/tokens", Token);
		app.use("/consults", require("./Routers/consultRouter"));
		app.use("/chats", require("./Routers/chatRouter"));
		app.use("/products", require("./Routers/ProductRoute"));
		app.use("/news", require("./Routers/NewsRouter"));
		app.use("/cart", require("./Routers/cartRouter"));
		app.use("/order", require("./Routers/OrderRouter"));
		app.use("/earnings", require("./Routers/EarningsRouter"));
		app.use("/email", require("./Routers/MailRouter"));

		// Start the server
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
		process.exit(1); // Exit the process if MongoDB connection fails
	});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
	process.exit(1); // Exit the process after handling uncaught exception
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Promise Rejection:", err);
	process.exit(1); // Exit the process after handling unhandled promise rejection
});
