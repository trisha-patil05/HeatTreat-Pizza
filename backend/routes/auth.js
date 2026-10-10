const express  = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const mongoose = require("mongoose");
const User     = require("../models/User");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router     = express.Router();

// ── Validation helper ──
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};


const JWT_SECRET = process.env.JWT_SECRET || "heattreat_secret_key"; // ✅
// REGISTER
router.post("/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username 3-20 characters ka hona chahiye")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username mein sirf letters, numbers aur underscore allowed hain"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email address daalo"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password kam se kam 6 characters ka hona chahiye")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage("Password mein kam se kam ek letter aur ek number hona chahiye"),
  ],
  validate,
  async (req, res) => {
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
  }
);

// LOGIN
router.post("/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username required hai"),
    body("password")
      .notEmpty()
      .withMessage("Password required hai"),
  ],
  validate,
  async (req, res) => {
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

    // Direct MongoDB se role fetch
    const db      = mongoose.connection.db;
    const rawUser = await db.collection("users").findOne({ username });
    const role    = rawUser?.role || rawUser?.['"role"'] || "user";
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
        role,
        username: user.username,
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// GET /api/auth/users — ✅ Admin only
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const db    = mongoose.connection.db;
    const users = await db.collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ── Forgot Password ──
const otpStore = {};

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required hai!" });

    const db   = mongoose.connection.db;
    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).json({ message: "Is email se koi account nahi mila!" });

    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;
    otpStore[email] = { otp, expiry };
    console.log(`OTP for ${email}: ${otp}`);

    const nodemailer  = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"🍕 HeatTreat Pizza" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Password Reset OTP — HeatTreat Pizza",
      html: `
        <div style="background:#0f1117;padding:30px;font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h1 style="color:#f97316;text-align:center">🍕 HeatTreat Pizza</h1>
          <div style="background:#1a1d28;border:1px solid #2a2d3e;border-radius:12px;padding:24px;text-align:center">
            <h2 style="color:#f1f5f9;margin:0 0 8px">Password Reset OTP</h2>
            <p style="color:#94a3b8;font-size:14px;margin:0 0 24px">Yeh OTP 10 minutes mein expire ho jaayega</p>
            <div style="background:#0f1117;border:2px solid #f97316;border-radius:10px;padding:20px;display:inline-block">
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

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email aur OTP required!" });

  const record = otpStore[email];
  if (!record)                    return res.status(400).json({ message: "Pehle OTP request karo!" });
  if (Date.now() > record.expiry) return res.status(400).json({ message: "OTP expire ho gaya!" });
  if (record.otp !== otp)         return res.status(400).json({ message: "Wrong OTP!" });

  return res.status(200).json({ message: "OTP verified!" });
});

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
    delete otpStore[email];

    return res.status(200).json({ message: "Password successfully reset!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;