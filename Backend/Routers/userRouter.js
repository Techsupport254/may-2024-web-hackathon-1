const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken, isAdmin } = require("../Middleware/Auth");
const User = require("../Models/UserModel");
const Settings = require("../Models/SettingsModel");
const {
	sendVerificationEmail,
	sendResetPasswordEmail,
} = require("./EmailRouter");

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

// Initialize settings for existing users if not present
const initializeSettingsForExistingUsers = async () => {
	try {
		const users = await User.find().populate("settings");
		for (const user of users) {
			if (!user.settings) {
				const newSettings = new Settings({ refId: user._id });
				await newSettings.save();
				user.settings = newSettings._id;
				await user.save();
			}
		}
	} catch (err) {
		console.error("Error initializing settings for existing users", err);
	}
};

initializeSettingsForExistingUsers();

// Handler for GET request to /api/users/:value
// Fetches user data by id, email, or username
router.get("/users/:value", authenticateToken, async (req, res) => {
	const { value } = req.params;

	try {
		let user;
		if (mongoose.Types.ObjectId.isValid(value)) {
			user = await User.findById(value).populate("settings");
		} else if (value.includes("@")) {
			user = await User.findOne({ email: value }).populate("settings");
		} else {
			user = await User.findOne({ username: value }).populate("settings");
		}

		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user data:", err);
		res.status(400).json({ message: "Error fetching user data", error: err });
	}
});

router.get("/user/:id", authenticateToken, async (req, res) => {
	try {
		const userId = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		const user = await User.findById(userId).populate("settings");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user data by ID:", err);
		res.status(400).json({ message: "Error fetching user data", error: err });
	}
});

// Get all users
router.get("/users", authenticateToken, async (req, res) => {
	try {
		const users = await User.find().populate("settings");
		res.status(200).json(users);
	} catch (err) {
		console.error("Error fetching users data:", err);
		res.status(400).json({ message: "Error fetching users data", error: err });
	}
});

router.patch("/users", authenticateToken, isAdmin, async (req, res) => {
	try {
		const users = await User.updateMany(
			{},
			{ $set: { loginStatus: "loggedOut" } }
		);
		res.status(200).json(users);
	} catch (err) {
		console.error("Error updating user data:", err);
		res.status(400).json({ message: "Error updating user data", error: err });
	}
});

router.patch("/user/:email", authenticateToken, isAdmin, async (req, res) => {
	try {
		const updatedUser = await User.updateOne(
			{ email: req.params.email },
			{ $set: req.body }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		console.error("Error updating user data by email:", err);
		res.status(400).json({ message: "Error updating user data", error: err });
	}
});

router.get("/user/:email", authenticateToken, isAdmin, async (req, res) => {
	try {
		const user = await User.findOne({ email: req.params.email }).populate(
			"settings"
		);
		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user data by email:", err);
		res.status(400).json({ message: "Error fetching user data", error: err });
	}
});

router.post("/", authenticateToken, isAdmin, async (req, res) => {
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

		const verificationCode = Math.floor(100000 + Math.random() * 900000);
		const verificationTokenExpiry = new Date(
			Date.now() + 60 * 60 * 1000
		).toISOString(); // 1 hour

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
			verificationCode,
			verificationTokenExpiry,
		});

		const newSettings = new Settings({ refId: newUser._id });
		await newSettings.save();
		newUser.settings = newSettings._id;

		await newUser.save();

		// Send verification email
		await sendVerificationEmail(
			newUser.email,
			verificationCode,
			verificationTokenExpiry
		);

		const token = jwt.sign(
			{ user: newUser._id, userType: newUser.userType },
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
		res.status(400).json({ message: "Error creating user", error: err });
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res.status(400).json({ message: "Please enter all fields" });
		}

		const existingUser = await User.findOne({ email }).populate("settings");
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

		const userData = {
			id: existingUser._id,
			name: existingUser.name,
			username: existingUser.username,
			email: existingUser.email,
			phone: existingUser.phone,
			profilePicture: existingUser.profilePicture,
			userType: existingUser.userType,
			location: existingUser.location,
			farmingType: existingUser.farmingType,
			businessName: existingUser.businessName,
			businessType: existingUser.businessType,
			businessLocation: existingUser.businessLocation,
			professionalType: existingUser.professionalType,
			businessDescription: existingUser.businessDescription,
			settings: existingUser.settings,
			verificationStatus: existingUser.verificationStatus,
		};

		// Include the entire user data object in the JWT payload
		const token = jwt.sign(userData, process.env.JWT_SECRET, {
			expiresIn: 60 * 60 * 24,
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
		});

		res.status(200).json({
			message: "Logged in successfully",
			token,
			...userData,
		});
	} catch (err) {
		console.error("Error logging in:", err);
		res.status(500).json({ message: "Server error", error: err });
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

// Send verification email after registration or upon request
router.get("/sendVerification", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Generate new verification code and update expiry time
		const verificationCode = Math.floor(100000 + Math.random() * 900000);
		const verificationTokenExpiry = new Date(
			Date.now() + 60 * 60 * 1000
		).toISOString(); // 1 hour

		user.verificationCode = verificationCode;
		user.verificationTokenExpiry = verificationTokenExpiry;

		await user.save();

		// Send the verification email
		await sendVerificationEmail(
			user.email,
			verificationCode,
			verificationTokenExpiry
		);

		res.status(200).json({ message: "Verification email sent successfully" });
	} catch (err) {
		console.error("Error sending verification email:", err);
		res
			.status(400)
			.json({ message: "Error sending verification email", error: err });
	}
});

// Verification link route
router.get("/verify", async (req, res) => {
	try {
		const { code } = req.query;

		const user = await User.findOne({
			verificationCode: code,
			verificationTokenExpiry: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid or expired verification token." });
		}

		user.verificationStatus = "verified";
		user.verificationCode = undefined;
		user.verificationTokenExpiry = undefined;

		await user.save();

		res.status(200).json({ message: "Email verified successfully." });
	} catch (err) {
		console.error("Error verifying user:", err);
		res.status(400).json({ message: "Error verifying user", error: err });
	}
});

router.post("/forgotPassword", async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "User does not exist" });
		}

		const resetToken = jwt.sign(
			{ userId: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		await sendResetPasswordEmail(user.email, resetToken);

		res.status(200).json({ message: "Password reset email sent" });
	} catch (err) {
		console.error("Error sending password reset email:", err);
		res
			.status(400)
			.json({ message: "Error sending password reset email", error: err });
	}
});

router.post("/resetPassword", async (req, res) => {
	const { resetToken, newPassword } = req.body;

	try {
		const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decoded.userId });

		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid token or user not found" });
		}

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(newPassword, salt);

		user.passwordHash = passwordHash;
		await user.save();

		res.status(200).json({ message: "Password reset successfully" });
	} catch (err) {
		console.error("Error resetting password:", err);
		res.status(400).json({ message: "Error resetting password", error: err });
	}
});

module.exports = router;
