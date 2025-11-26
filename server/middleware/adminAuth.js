const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify admin role
const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header("auth-token");
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Verify token
        const JWT_SECRET = process.env.JWT_SECRET || "ChotiGold$Arc";
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.user.id).select('-password');

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin privileges required." });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Admin auth middleware error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = adminAuth;
