require("dotenv").config();
const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const rateLimit = require("express-rate-limit");
const authRoutes    = require("./routes/auth");
const orderRoutes   = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const wheelRoutes = require("./routes/wheel")

const app = express();

// ✅ Allow both local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://heat-treat-pizza.vercel.app"
];


// ✅ Global rate limit — 100 requests per 15 min
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests! Thodi der baad try karo." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ✅ Auth rate limit — 5 attempts per 15 min (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts! 15 minutes baad try karo." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ OTP rate limit — 3 attempts per 10 min
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { message: "Too many OTP requests! 10 minutes baad try karo." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS: Origin not allowed - " + origin), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "HeatTreat Pizza Backend 🍕 Running!" });
});

app.use("/api/auth/login",           authLimiter);
app.use("/api/auth/register",        authLimiter);
app.use("/api/auth/forgot-password",  otpLimiter);
app.use("/api/auth",    authRoutes);
app.use("/api/orders",  orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/wheel", wheelRoutes)

const MONGO_URI = process.env.MONGO_URI;
const PORT      = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set in .env file!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});