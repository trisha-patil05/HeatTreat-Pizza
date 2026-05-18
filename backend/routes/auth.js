const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const mongoose = require("mongoose");
const User    = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = "heattreat_secret_key";

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing)
      return res.status(400).json({ message: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "Registration successful. Please login now." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid username or password" });

    // ✅ Direct MongoDB driver se role fetch karo — Mongoose bypass
    const db = mongoose.connection.db;
    const rawUser = await db.collection("users").findOne({ username });
    
    // Sab possible keys check karo
    const allKeys = Object.keys(rawUser);
    console.log("All keys in DB document:", allKeys);
    console.log("Raw document:", JSON.stringify(rawUser));
    
    // Role dhundho — quoted ya unquoted dono check karo
    const role = rawUser?.role || rawUser?.['"role"'] || "user";
    console.log("Final role:", role);

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id:       user._id,
        name:     user.username,
        email:    user.email,
        role:     role,
        username: user.username,
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// GET /api/auth/users
router.get("/users", protect, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const users = await db.collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;