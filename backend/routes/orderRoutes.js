const express  = require("express");
const mongoose = require("mongoose");
const Order    = require("../models/Order");
const User     = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { sendOrderConfirmationEmail, sendStatusUpdateEmail } = require("../services/emailService");

const router = express.Router();

// POST /api/orders — Order place + Email
router.post("/", protect, async (req, res) => {
  try {
    const { cartItems, totalAmount, address, payment } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart empty hai!" });
    if (!address || !address.trim())
      return res.status(400).json({ message: "Address required hai!" });

    const newOrder = new Order({
      user: req.user.id, cartItems, totalAmount, address,
      payment: payment || "cash", status: "Placed"
    });
    const savedOrder = await newOrder.save();

    // ✅ Email bhejo — async (order response slow nahi hoga)
    const db      = mongoose.connection.db;
    const rawUser = await db.collection("users").findOne({ _id: req.user._id });
    const email   = rawUser?.email || req.user.email;
    if (email) {
      sendOrderConfirmationEmail(email, {
        orderId: savedOrder._id, cartItems, totalAmount, address, payment: payment || "cash",
      });
    }

    return res.status(201).json({ message: "Order placed!", order: savedOrder });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// GET /api/orders/my
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/all — Admin
router.get("/all", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("user","username email").sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/analytics
router.get("/analytics", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("user","username email");
    const users  = await User.find();
    const totalRevenue  = orders.filter(o => o.status==="Delivered").reduce((s,o) => s+o.totalAmount, 0);
    const statusBreakdown = { Placed:0, Preparing:0, "Out for Delivery":0, Delivered:0, Cancelled:0 };
    orders.forEach(o => { if(statusBreakdown[o.status]!==undefined) statusBreakdown[o.status]++; });
    const paymentBreakdown = { cash:0, card:0, upi:0 };
    orders.forEach(o => { if(paymentBreakdown[o.payment]!==undefined) paymentBreakdown[o.payment]++; });
    const last7Days = [];
    for (let i=6; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const s = new Date(d.setHours(0,0,0,0)), e = new Date(d.setHours(23,59,59,999));
      const day = orders.filter(o => { const c=new Date(o.createdAt); return c>=s&&c<=e; });
      last7Days.push({ date: s.toLocaleDateString('en-IN',{weekday:'short',day:'numeric'}), orders: day.length, revenue: day.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.totalAmount,0) });
    }
    const pizzaCount = {};
    orders.forEach(o => o.cartItems.forEach(i => { pizzaCount[i.name]=(pizzaCount[i.name]||0)+(i.quantity||1); }));
    const topPizzas = Object.entries(pizzaCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({name,count}));
    return res.status(200).json({
      totalRevenue, totalOrders: orders.length, totalUsers: users.length,
      pendingOrders: orders.filter(o=>!["Delivered","Cancelled"].includes(o.status)).length,
      statusBreakdown, paymentBreakdown, last7Days, topPizzas,
      recentOrders: orders.slice(0,5).map(o=>({ id:o._id.toString().slice(-6).toUpperCase(), user:o.user?.username||"Unknown", total:o.totalAmount, status:o.status, time:new Date(o.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PATCH /api/orders/:id/status — Status update + Email
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    ).populate("user","username email");

    // ✅ Status update email
    if (updated?.user?.email) {
      sendStatusUpdateEmail(updated.user.email, { orderId: updated._id, status: req.body.status });
    }
    return res.status(200).json({ order: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;