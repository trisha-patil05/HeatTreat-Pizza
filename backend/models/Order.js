import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cartItems: [
      {
        id: { type: String, required: true }, // matches your cart item.id
        name: String,
        size: String,
        price: Number,
        quantity: { type: Number, default: 1 }
      }
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, default: "placed" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
