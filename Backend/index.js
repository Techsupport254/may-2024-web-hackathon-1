require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Token = require("./Routers/TokenRouter");
const path = require("path");

// set up server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
	cors({
		origin: [
			"https://64a9a3169a13931f8141994b--agrisolve.netlify.app",
			"http://localhost:5173",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		credentials: true,
	})
);
app.use(cookieParser());

// connect to MongoDB using promises
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connection established");
		// set up routes after the database connection is established
		app.use("/auth", require("./Routers/userRouter"));
		app.get("/", (req, res) => res.send("API running"));
		app.use("/payment", require("./Routers/paymentRouter"));
		app.use("/tokens", Token);
		app.use("/consults", require("./Routers/consultRouter"));
		app.use("/chats", require("./Routers/chatRouter"));

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});
