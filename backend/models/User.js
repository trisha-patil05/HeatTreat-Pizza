const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    // ✅ enum hataya — strict validation nahi hogi
    role: {
      type: String,
      default: "user"
    },
    phone:   { type: String, default: "" },
    address: { type: String, default: "" },
    avatar:  { type: String, default: "" },
  },
  { 
    timestamps: true,
    strict: false  // ✅ Extra fields ignore nahi honge
  }
);

module.exports = mongoose.model("User", userSchema);
