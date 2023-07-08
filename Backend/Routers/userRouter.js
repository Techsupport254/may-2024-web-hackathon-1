const router = require("express").Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Handler for GET request to /api/user
// Fetches user data
router.get("/user", async (req, res) => {
	try {
		// Fetch the user data from the database
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching user data",
			error: err,
		});
	}
});

// Handler for GET request to /api/users
// Fetches users data
router.get("/users", async (req, res) => {
	try {
		// Fetch the user data from the database
		const users = await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching user data",
			error: err,
		});
	}
});

// Handler for Patch request to /api/user/:email
// Updates user data by email
router.patch("/user/:email", async (req, res) => {
	try {
		// Fetch the user data from the database
		const user = await User.findOne({ email: req.params.email });
		const updatedUser = await User.updateOne(
			{ email: req.params.email },
			{ $set: req.body }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(400).json({
			message: "Error updating user data",
			error: err,
		});
	}
});

// Handler for GET request to /api/user/:email
// Fetches user data by email
router.get("/user/:email", async (req, res) => {
	try {
		// Fetch the user data from the database
		const user = await User.findOne({ email: req.params.email });
		res.status(200).json(user);
	} catch (err) {
		res.status(400).json({
			message: "Error fetching user data",
			error: err,
		});
	}
});

// Handler for POST requests to /users
// Registers a new user
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
		// Validation
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

		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}

		// Hash password
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		// Save new user
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

		// log in user token
		const token = jwt.sign(
			{
				user: newUser._id,
			},
			process.env.JWT_SECRET
		);

		// send token in HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		res.status(200).json({ message: "User created successfully" });
	} catch (err) {
		res.status(400).json({
			message: "Error creating user",
			error: err,
		});
	}
});

// Handler for POST request to /users/login
// Login user
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Validation
		if (!email || !password) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		// Check if user exists
		const existingUser = await User.findOne({ email: email });
		if (!existingUser) {
			return res.status(400).json({ message: "User does not exist" });
		}

		// Check if password is correct
		const passwordMatch = await bcrypt.compare(
			password,
			existingUser.passwordHash
		);
		if (!passwordMatch) {
			return res.status(400).json({ message: "Invalid password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				user: existingUser._id,
			},
			process.env.JWT_SECRET
		);

		// Send token in HTTP-only cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		res.status(200).json({ message: "Logged in successfully" });
	} catch (err) {
		res.status(400).json({
			message: "Error logging in",
			error: err,
		});
	}
});

// Handler for GET request to /users/logout
// Logout user
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

// Handler for GET request to /users/loggedIn
// Check if user is logged in
router.get("/loggedIn", (req, res) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.json(false);
		}

		jwt.verify(token, process.env.JWT_SECRET);

		res.send(true);
	} catch (err) {
		res.json(false);
	}
});

// Handler for GET request to /users/verify
// Verify user
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
		res.status(400).json({
			message: "Error verifying user",
			error: err,
		});
	}
});

// Handler for POST request to /users/forgotPassword
// Send password reset email
router.post("/forgotPassword", async (req, res) => {
	try {
		// TODO: Send password reset email
	} catch (err) {
		res.status(400).json({
			message: "Error sending password reset email",
			error: err,
		});
	}
});

// Handler for POST request to /users/resetPassword
// Reset user password
router.post("/resetPassword", async (req, res) => {
	try {
		// TODO: Reset user password
	} catch (err) {
		res.status(400).json({
			message: "Error resetting password",
			error: err,
		});
	}
});

module.exports = router;
