const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "10% OFF"
    type: {
      type: String,
      enum: ["percentage", "free_item", "none"],
      default: "percentage",
    },
    value: { type: Number, default: 0 }, // percent off, or ignored for free_item/none
    weight: { type: Number, required: true }, // odds — higher = more common
    color: { type: String, default: "#FFB000" },
  },
  { _id: false }
);

const wheelConfigSchema = new mongoose.Schema({
  // Single-restaurant setup: only one config document should ever exist.
  // If you run multiple restaurant locations, add a `restaurantId` field
  // here and query/update by that instead.
  prizes: {
    type: [prizeSchema],
    default: [
      { label: "10% OFF", type: "percentage", value: 10, weight: 35, color: "#FFB000" },
      { label: "15% OFF", type: "percentage", value: 15, weight: 20, color: "#FF6B6B" },
      { label: "Free Garlic Bread", type: "free_item", value: 0, weight: 15, color: "#4ECDC4" },
      { label: "20% OFF", type: "percentage", value: 20, weight: 10, color: "#95E1D3" },
      { label: "Try Again", type: "none", value: 0, weight: 20, color: "#C7C7C7" },
    ],
  },
  popupDelaySeconds: { type: Number, default: 5 },
  showOncePerVisitor: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  couponValidDays: { type: Number, default: 7 },
});

module.exports = mongoose.model("WheelConfig", wheelConfigSchema);
