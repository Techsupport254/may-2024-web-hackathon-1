const dotenv = require("dotenv");
const express = require("express");
const mysql = require("mysql2"); //
const bcrypt = require("bcrypt");
const app = express();
const bodyParser = require("body-parser");

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message || "Something broke!" });
});

// Database connection
const db = mysql.createConnection({
	host: process.env.DB_HOST || "localhost",
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "expense_tracker",
});

// Test connection
db.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err);
		return;
	}
	console.log("Connected to MySQL as id:", db.threadId);

	// Create table if not exists
	const createTableQuery = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      amount DECIMAL(10, 2) NOT NULL,
      date DATE NOT NULL,
      category VARCHAR(255),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

	db.query(createTableQuery, (err, result) => {
		if (err) {
			console.error("Error creating table:", err);
			return;
		}
		console.log("Table 'expenses' created/checked successfully");
	});
});

// Api running
app.get("/", (req, res) => {
	res.send("API is running...");
});

// User registration
app.post("/registration", async (req, res) => {
	try {
		const { email, username, password } = req.body;

		if (!email || !username || !password) {
			return res.status(400).json({
				message: "All fields (email, username, password) are required",
			});
		}

		// Check if user already exists
		const [existingUser] = await db
			.promise()
			.query("SELECT * FROM users WHERE email = ?", [email]);
		if (existingUser.length > 0) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash password
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		// Insert new user into the database
		const [result] = await db
			.promise()
			.query("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", [
				email,
				username,
				hashedPassword,
			]);

		// Respond with success message
		res.status(201).json({
			message: "User registered successfully",
			userId: result.insertId,
		});
	} catch (error) {
		console.error("Error during registration:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// User authentication API route
const users = [
	{
		id: 3,
		username: "anit",
		password: "$2b$10$KIX4dW4BCjvhxV91suoJFOjPszW8GBu/2vSzX/N2tKOZUlYBrYfjy",
	},
];

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
	const { username, password } = req.body;

	// Check if username and password are provided
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}

	const user = users.find((u) => u.username === username);

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	try {
		if (await bcrypt.compare(password, user.password)) {
			// Passwords match
			res.json({ message: "Login successful" });
		} else {
			// Passwords don't match
			res.status(401).json({ message: "Invalid credentials" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Expense data (for demonstration purposes only; use database instead in production)
let expenses = [
	{ id: 1, userId: 1, description: "Expense 1", amount: 50 },
	{ id: 2, userId: 1, description: "Expense 2", amount: 100 },
];

// GET all expenses
app.get("/api/expenses", (req, res) => {
	// Replace with actual user ID if applicable
	const userExpenses = expenses.filter((expense) => expense.userId === 1); // Assuming userId 1 for demo
	res.json(userExpenses);
});

// POST new expense
app.post("/api/expenses", (req, res) => {
	const { description, amount } = req.body;
	const newExpense = {
		id: expenses.length + 1,
		userId: 1,
		description,
		amount,
	};
	expenses.push(newExpense);
	res.status(201).json(newExpense);
});

// Update expense by ID
app.put("/api/expenses/:id", (req, res) => {
	const expenseId = parseInt(req.params.id);
	const { description, amount } = req.body;
	const index = expenses.findIndex((expense) => expense.id === expenseId);
	if (index !== -1) {
		expenses[index] = { ...expenses[index], description, amount };
		res.json(expenses[index]);
	} else {
		res.status(404).json({ message: "Expense not found" });
	}
});

// DELETE expense by ID
app.delete("/api/expenses/:id", (req, res) => {
	const expenseId = parseInt(req.params.id);
	expenses = expenses.filter((expense) => expense.id !== expenseId);
	res.status(204).send();
});

// Total expenses
app.get("/api/expense", (req, res) => {
	const totalExpense = expenses.reduce(
		(acc, expense) => acc + expense.amount,
		0
	);
	res.json({ totalExpense });
});

// Server running
const PORT = 3500;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
