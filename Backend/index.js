require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Token = require("./Routers/TokenRouter");
const path = require("path");
const multer = require("multer");

// Set up server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Set up Multer middleware
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Save uploaded images to the "uploads" directory
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

const upload = multer({ storage: storage });

app.use(
	cors({
		origin: [
			"https://64a9a4a990908322a0ade04c--agrisolve.netlify.app",
			"http://localhost:5173",
		],
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

		// Use the "upload" middleware for handling image uploads
		app.post("/api/images", upload.single("image"), (req, res, next) => {
			// Check if an image file was provided
			if (!req.file) {
				return res.status(400).json({ message: "No image file provided." });
			}
			// The uploaded image file can be accessed using "req.file"
			console.log("Uploaded image:", req.file);
			res
				.status(200)
				.json({ message: "Image uploaded successfully.", image: req.file });
		});

		// Set up a route to serve uploaded images
		app.use("/uploads", express.static("uploads"));

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
