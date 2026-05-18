const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/profile — Apna profile fetch karo
router.get("/", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/profile — Profile update karo
router.put("/", protect, async (req, res) => {
    try {
        const { username, email, phone, address } = req.body;

        // Username/email already exist check
        if (username) {
            const existing = await User.findOne({ username, _id: { $ne: req.user.id } });
            if (existing) return res.status(400).json({ message: "Username already taken!" });
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { username, email, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated!",
            user: updated
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/profile/password — Password change karo
router.put("/password", protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Current password galat hai!" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password kam se kam 6 characters ka hona chahiye!" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password successfully changed!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;