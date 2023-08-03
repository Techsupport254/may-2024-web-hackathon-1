require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Token = require("./Routers/TokenRouter");

// Set up server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Set up CORS to allow all origins with credentials
app.use(
	cors({
		origin: true,
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

		// Set up routes after the database connection is established
		app.use("/auth", require("./Routers/userRouter"));
		app.get("/", (req, res) => res.send("API running"));
		app.use("/payment", require("./Routers/paymentRouter"));
		app.use("/tokens", Token);
		app.use("/consults", require("./Routers/consultRouter"));
		app.use("/chats", require("./Routers/chatRouter"));

		// Start the server
		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});
