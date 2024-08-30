const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token required" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid token" });
		}
		req.user = user;
		next();
	});
}

function isAdmin(req, res, next) {
	try {
		if (req.user && req.user.id === process.env.ADMIN_ID) {
			next();
		} else {
			res.status(403).json({ message: "Admin access required" });
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "An error occurred while checking admin access" });
	}
}

module.exports = { authenticateToken, isAdmin };
