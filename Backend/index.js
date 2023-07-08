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

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
	});
}

app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://64a9332dbcf4a16639b0bfb7--incandescent-pika-29918c.netlify.app/",
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
