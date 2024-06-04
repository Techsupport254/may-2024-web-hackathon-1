const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Handler for GET request to /api/users/:value
// Fetches user data by id, email, or username
router.get("/users/:value", async (req, res) => {
	const { value } = req.params;

	try {
		let user;
		if (mongoose.Types.ObjectId.isValid(value)) {
			user = await User.findById(value);
		} else if (value.includes("@")) {
			user = await User.findOne({ email: value });
		} else {
			user = await User.findOne({ username: value });
		}

		if (!user) {
			return res.status(404).json({
				message: "User not found.",
			});
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user data:", err);
		res.status(400).json({
			message: "Error fetching user data",
			error: err,
		});
	}
});

// Existing routes
router.get("/user/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user data by ID:", err);
		res.status(400).json({
			message: "Error fetching user data",
			error: err,
		});
	}
});

router.get("/users", async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		console.error("Error fetching users data:", err);
		res.status(400).json({
			message: "Error fetching users data",
			error: err,
		});
	}
});

router.patch("/users", async (req, res) => {
	try {
		const users = await User.updateMany(
			{},
			{ $set: { loginStatus: "loggedOut" } }
		);
		res.status(200).json(users);
	} catch (err) {
		console.error("Error updating user data:", err);
		res.status(400).json({
			message: "Error updating user data",
			error: err,
		});
	}
});

router.patch("/user/:email", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.params.email });
		const updatedUser = await User.updateOne(
			{ email: req.params.email },
			{ $set: req.body }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		console.error("Error updating user data by email:", err);
		res.status(400).json({
			message: "Error updating user data",
			error: err,
		});
	}
});

router.get("/user/:email", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.params.email });
		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user data by email:", err);
		res.status(400).json({
			message: "Error fetching user data",
			error: err,
		});
	}
});

router.post("/", async (req, res) => {
	const {
		name,
		username,
		email,
		phone,
		userType,
		location,
		password,
		farmingType,
		businessName,
		businessType,
		businessLocation,
		professionalType,
		businessDescription,
	} = req.body;

	try {
		if (
			!name ||
			!username ||
			!email ||
			!phone ||
			!userType ||
			!location ||
			!password
		) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			name,
			username,
			email,
			phone,
			userType,
			location,
			passwordHash,
			farmingType,
			businessName,
			businessType,
			businessLocation,
			professionalType,
			businessDescription,
			verificationCode: Math.floor(100000 + Math.random() * 900000),
		});
		await newUser.save();

		const token = jwt.sign(
			{
				user: newUser._id,
			},
			process.env.JWT_SECRET
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		res.status(200).json({ message: "User created successfully" });
	} catch (err) {
		console.error("Error creating user:", err);
		res.status(400).json({
			message: "Error creating user",
			error: err,
		});
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const passwordMatch = await bcrypt.compare(
			password,
			existingUser.passwordHash
		);
		if (!passwordMatch) {
			return res.status(400).json({ message: "Invalid password" });
		}

		const token = jwt.sign(
			{
				user: existingUser._id,
			},
			process.env.JWT_SECRET
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		res.status(200).json({ message: "Logged in successfully", token, email });
	} catch (err) {
		console.error("Error logging in:", err);
		res.status(400).json({
			message: "Error logging in",
			error: err,
		});
	}
});

router.get("/logout", (req, res) => {
	res
		.cookie("token", "", {
			httpOnly: true,
			expires: new Date(0),
			secure: true,
			sameSite: "none",
		})
		.send();
});

router.get("/loggedIn", (req, res) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.json(false);
		}

		jwt.verify(token, process.env.JWT_SECRET);

		res.send(true);
	} catch (err) {
		console.error("Error checking login status:", err);
		res.json(false);
	}
});

router.get("/verify", async (req, res) => {
	try {
		const user = await User.findOne({ verificationCode: req.query.code });
		if (!user) {
			return res.status(400).json({ message: "Invalid verification code" });
		}

		const updatedUser = await User.updateOne(
			{ verificationCode: req.query.code },
			{ $set: { verificationStatus: "verified" } }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		console.error("Error verifying user:", err);
		res.status(400).json({
			message: "Error verifying user",
			error: err,
		});
	}
});

router.post("/forgotPassword", async (req, res) => {
	try {
		// TODO: Send password reset email
	} catch (err) {
		console.error("Error sending password reset email:", err);
		res.status(400).json({
			message: "Error sending password reset email",
			error: err,
		});
	}
});

router.post("/resetPassword", async (req, res) => {
	try {
		// TODO: Reset user password
	} catch (err) {
		console.error("Error resetting password:", err);
		res.status(400).json({
			message: "Error resetting password",
			error: err,
		});
	}
});

module.exports = router;
