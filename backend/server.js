const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes    = require("./routes/auth");
const orderRoutes   = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors({
  origin: "https://your-frontend-name.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "HeatTreat Pizza Backend 🍕 Running!" });
});

app.use("/api/auth",    authRoutes);
app.use("/api/orders",  orderRoutes);
app.use("/api/profile", profileRoutes);

// ✅ .env variables use karo
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Trisha05:Eskt5105@cluster1.edjmjaq.mongodb.net/HeatTreatPizzaDB";
const PORT      = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});