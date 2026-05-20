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

// ── Forgot Password — OTP Store ──
const otpStore = {}; // { email: { otp, expiry } }

// POST /api/auth/forgot-password — OTP bhejo
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required hai!" });

    // User check karo
    const db   = mongoose.connection.db;
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).json({ message: "Is email se koi account nahi mila!" });

    // 6-digit OTP generate karo
    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore[email] = { otp, expiry };

    console.log(`OTP for ${email}: ${otp}`); // Debug

    // Email bhejo
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "05amtics036@gmail.com", pass: "plswsosvnonybsnt" }
    });

    await transporter.sendMail({
      from: `"🍕 HeatTreat Pizza" <05amtics036@gmail.com>`,
      to: email,
      subject: "🔑 Password Reset OTP — HeatTreat Pizza",
      html: `
        <div style="background:#0f1117;padding:30px;font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <div style="text-align:center;margin-bottom:20px">
            <h1 style="color:#f97316;margin:0">🍕 HeatTreat Pizza</h1>
          </div>
          <div style="background:#1a1d28;border:1px solid #2a2d3e;border-radius:12px;padding:24px;text-align:center">
            <h2 style="color:#f1f5f9;margin:0 0 8px">Password Reset OTP</h2>
            <p style="color:#94a3b8;font-size:14px;margin:0 0 24px">Yeh OTP 10 minutes mein expire ho jaayega</p>
            <div style="background:#0f1117;border:2px solid #f97316;border-radius:10px;padding:20px;margin:0 auto;display:inline-block">
              <span style="font-size:36px;font-weight:700;color:#f97316;letter-spacing:12px">${otp}</span>
            </div>
            <p style="color:#64748b;font-size:12px;margin:20px 0 0">Agar aapne yeh request nahi kiya toh ignore karein.</p>
          </div>
        </div>
      `
    });

    return res.status(200).json({ message: "OTP bheja gaya! Email check karo." });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/verify-otp — OTP verify karo
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email aur OTP required!" });

  const record = otpStore[email];
  if (!record)                    return res.status(400).json({ message: "Pehle OTP request karo!" });
  if (Date.now() > record.expiry) return res.status(400).json({ message: "OTP expire ho gaya! Dobara bhejo." });
  if (record.otp !== otp)         return res.status(400).json({ message: "Wrong OTP! Dobara try karo." });

  return res.status(200).json({ message: "OTP verified!" });
});

// POST /api/auth/reset-password — Naya password set karo
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Sab fields required hain!" });

    const record = otpStore[email];
    if (!record)                    return res.status(400).json({ message: "OTP expired ya invalid!" });
    if (Date.now() > record.expiry) return res.status(400).json({ message: "OTP expire ho gaya!" });
    if (record.otp !== otp)         return res.status(400).json({ message: "Wrong OTP!" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const db = mongoose.connection.db;
    await db.collection("users").updateOne({ email }, { $set: { password: hashedPassword } });

    delete otpStore[email]; // OTP use ho gaya — delete karo
    return res.status(200).json({ message: "Password successfully reset!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;