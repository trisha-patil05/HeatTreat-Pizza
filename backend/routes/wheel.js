const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");
const WheelConfig = require("../models/WheelConfig");
const { sendCouponEmail } = require("../utils/mailer");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ensures exactly one config document exists, creating defaults on first run.
async function getOrCreateConfig() {
  let config = await WheelConfig.findOne();
  if (!config) {
    config = await WheelConfig.create({});
  }
  return config;
}

function pickPrize(prizes) {
  const total = prizes.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (const prize of prizes) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }
  return prizes[prizes.length - 1];
}

function generateCouponCode(prize) {
  const prefix = prize.label.replace(/[^A-Z0-9]/gi, "").slice(0, 6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${random}`;
}


router.get("/has-spun", async (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) return res.json({ hasSpun: false });
    const entry = await Entry.findOne({ email });
    res.json({ hasSpun: Boolean(entry) });
  } catch (err) {
    console.error("has-spun check failed:", err);
    res.status(500).json({ error: "Could not check status" });
  }
});

// GET /api/wheel/config
// Public endpoint the frontend calls on page load to render the wheel
// with the restaurant's current prizes/colors/behavior.
router.get("/config", async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    if (!config.isActive) {
      return res.json({ isActive: false });
    }
    res.json({
      isActive: true,
      prizes: config.prizes.map((p) => ({ label: p.label, color: p.color })),
      popupDelaySeconds: config.popupDelaySeconds,
      showOncePerVisitor: config.showOncePerVisitor,
    });
  } catch (err) {
    console.error("Failed to load wheel config:", err);
    res.status(500).json({ error: "Could not load wheel config" });
  }
});

// POST /api/wheel/spin  { email }
// Validates, picks a weighted prize, generates a coupon (if any), saves
// the entry, and returns what the wheel should land on.
router.post("/spin", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const config = await getOrCreateConfig();
    if (!config.isActive) {
      return res.status(403).json({ error: "This promotion is no longer active" });
    }

    if (config.showOncePerVisitor) {
      const already = await Entry.findOne({ email });
      if (already) {
        return res.status(409).json({ error: "Looks like you've already spun the wheel!" });
      }
    }

    const prize = pickPrize(config.prizes);
    const hasReward = prize.type !== "none";
    const couponCode = hasReward ? generateCouponCode(prize) : null;
    const expiresAt = new Date(Date.now() + config.couponValidDays * 24 * 60 * 60 * 1000);

    await Entry.create({
      email,
      prizeLabel: prize.label,
      couponCode,
      discountPercent: prize.type === "percentage" ? prize.value : 0,
      expiresAt,
    });

    if (couponCode) {
      // Fire and forget — don't make the customer wait on email delivery.
      sendCouponEmail({ to: email, prizeLabel: prize.label, couponCode }).catch((err) =>
        console.error("Email send failed:", err)
      );
    }

    res.json({
      prizeLabel: prize.label,
      prizeIndex: config.prizes.findIndex((p) => p.label === prize.label),
      couponCode,
    });
  } catch (err) {
    console.error("Spin failed:", err);
    res.status(500).json({ error: "Something went wrong, please try again" });
  }
});

// POST /api/wheel/redeem  { couponCode }
// Call this from your checkout/order-placement flow to validate + apply
// a coupon, and to make sure it can't be used twice.
router.post("/redeem", async (req, res) => {
  try {
    const couponCode = String(req.body.couponCode || "").trim().toUpperCase();
    const entry = await Entry.findOne({ couponCode });

    if (!entry) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }
    if (entry.isRedeemed) {
      return res.status(409).json({ error: "This coupon has already been used" });
    }
    if (entry.expiresAt < new Date()) {
      return res.status(410).json({ error: "This coupon has expired" });
    }

    entry.isRedeemed = true;
    await entry.save();

    res.json({
      valid: true,
      prizeLabel: entry.prizeLabel,
      discountPercent: entry.discountPercent,
    });
  } catch (err) {
    console.error("Redeem failed:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ─────────────────────────────────────────────────────────────
// Admin-only routes below — protected with your existing
// protect + isAdmin middleware (only logged-in admins can call these).
// ─────────────────────────────────────────────────────────────

// GET /api/wheel/admin/config — full config for the admin settings page
router.get("/admin/config", protect, isAdmin, async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({ config });
  } catch (err) {
    console.error("Failed to load admin config:", err);
    res.status(500).json({ error: "Could not load config" });
  }
});

// PUT /api/wheel/admin/config — update prizes/odds/behavior
router.put("/admin/config", protect, isAdmin, async (req, res) => {
  try {
    const { prizes, popupDelaySeconds, showOncePerVisitor, isActive, couponValidDays } = req.body;

    if (!prizes || prizes.length === 0) {
      return res.status(400).json({ error: "You need at least one prize on the wheel." });
    }
    const totalWeight = prizes.reduce((s, p) => s + Number(p.weight || 0), 0);
    if (totalWeight <= 0) {
      return res.status(400).json({ error: "Prize odds can't all be zero." });
    }

    const config = await getOrCreateConfig();
    config.prizes = prizes;
    if (popupDelaySeconds !== undefined) config.popupDelaySeconds = popupDelaySeconds;
    if (showOncePerVisitor !== undefined) config.showOncePerVisitor = showOncePerVisitor;
    if (isActive !== undefined) config.isActive = isActive;
    if (couponValidDays !== undefined) config.couponValidDays = couponValidDays;
    await config.save();

    res.json({ success: true, config });
  } catch (err) {
    console.error("Failed to update config:", err);
    res.status(500).json({ error: "Could not save changes" });
  }
});

// GET /api/wheel/admin/entries — list of all spins/winners
router.get("/admin/entries", protect, isAdmin, async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 }).limit(200);
    res.json({ entries });
  } catch (err) {
    console.error("Failed to load entries:", err);
    res.status(500).json({ error: "Could not load entries" });
  }
});

// GET /api/wheel/admin/stats — quick dashboard numbers
router.get("/admin/stats", protect, isAdmin, async (req, res) => {
  try {
    const [totalSpins, totalWins] = await Promise.all([
      Entry.countDocuments(),
      Entry.countDocuments({ couponCode: { $ne: null } }),
    ]);
    res.json({ totalSpins, totalWins });
  } catch (err) {
    console.error("Failed to load stats:", err);
    res.status(500).json({ error: "Could not load stats" });
  }
});

module.exports = router;
