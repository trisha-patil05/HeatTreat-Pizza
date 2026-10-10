const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  prizeLabel: { type: String, required: true },
  couponCode: { type: String, default: null },
  discountPercent: { type: Number, default: 0 },
  isRedeemed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

entrySchema.index({ email: 1 });
entrySchema.index({ couponCode: 1 });

module.exports = mongoose.model("Entry", entrySchema);
