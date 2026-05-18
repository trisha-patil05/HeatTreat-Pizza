const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [
      {
        id:       { type: String, required: true },
        name:     { type: String },
        size:     { type: String },
        price:    { type: Number },
        quantity: { type: Number, default: 1 },
      }
    ],
    totalAmount: { type: Number, required: true },
    address:     { type: String, required: true },
    payment:     { type: String, default: "cash" },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);