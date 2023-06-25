require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios"); // Add this line to import axios
const Token = require("./Routers/TokenRouter.jsx"); // Add this line to import Token model

// set up server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
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
		app.use("/auth", require("./Routers/userRouter.jsx"));
		app.get("/", (req, res) => res.send("API running"));
		app.use("/payment", require("./Routers/paymentRouter.jsx"));
		app.use("/tokens", Token); // Add this line to use Token router

		app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});
