const jwt      = require("jsonwebtoken");
const mongoose = require("mongoose");
const User     = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "heattreat_secret_key";

// ── protect — Login check ──
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ── isAdmin — Admin check ──
const isAdmin = async (req, res, next) => {
  try {
    const db      = mongoose.connection.db;
    const rawUser = await db.collection("users").findOne({ _id: req.user._id });
    const role    = rawUser?.role || "user";

    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied! Admin only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protect, isAdmin };