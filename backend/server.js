const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Backend connected successfully 🚀" });
});

app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/pizzaapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});