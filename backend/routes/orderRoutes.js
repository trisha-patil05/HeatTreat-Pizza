const express  = require("express");
const Order    = require("../models/Order");
const User     = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/orders — Order place karo
router.post("/", protect, async (req, res) => {
  try {
    const { cartItems, totalAmount, address, payment } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart empty hai!" });

    if (!address || !address.trim())
      return res.status(400).json({ message: "Address required hai!" });

    const newOrder = new Order({
      user: req.user.id,
      cartItems,
      totalAmount,
      address,
      payment: payment || "cash",
      status: "Placed"
    });

    const savedOrder = await newOrder.save();
    return res.status(201).json({ message: "Order placed!", order: savedOrder });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
});

// GET /api/orders/my — Us user ke saare orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/all — Admin ke liye saare orders
router.get("/all", protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/analytics — Admin analytics
router.get("/analytics", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "username email");
    const users  = await User.find();

    // Total stats
    const totalRevenue = orders
      .filter(o => o.status === "Delivered")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders  = orders.length;
    const totalUsers   = users.length;
    const pendingOrders = orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length;

    // Status breakdown
    const statusBreakdown = {
      Placed:           orders.filter(o => o.status === "Placed").length,
      Preparing:        orders.filter(o => o.status === "Preparing").length,
      "Out for Delivery": orders.filter(o => o.status === "Out for Delivery").length,
      Delivered:        orders.filter(o => o.status === "Delivered").length,
      Cancelled:        orders.filter(o => o.status === "Cancelled").length,
    };

    // Payment breakdown
    const paymentBreakdown = {
      cash: orders.filter(o => o.payment === "cash").length,
      card: orders.filter(o => o.payment === "card").length,
      upi:  orders.filter(o => o.payment === "upi").length,
    };

    // Last 7 days orders
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd   = new Date(date.setHours(23, 59, 59, 999));

      const dayOrders = orders.filter(o => {
        const created = new Date(o.createdAt);
        return created >= dayStart && created <= dayEnd;
      });

      last7Days.push({
        date: dayStart.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter(o => o.status === "Delivered")
          .reduce((sum, o) => sum + o.totalAmount, 0),
      });
    }

    // Top pizzas
    const pizzaCount = {};
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        pizzaCount[item.name] = (pizzaCount[item.name] || 0) + (item.quantity || 1);
      });
    });

    const topPizzas = Object.entries(pizzaCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return res.status(200).json({
      totalRevenue,
      totalOrders,
      totalUsers,
      pendingOrders,
      statusBreakdown,
      paymentBreakdown,
      last7Days,
      topPizzas,
      recentOrders: orders.slice(0, 5).map(o => ({
        id: o._id.toString().slice(-6).toUpperCase(),
        user: o.user?.username || "Unknown",
        total: o.totalAmount,
        status: o.status,
        time: new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      })),
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
});

// PATCH /api/orders/:id/status — Status update
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    return res.status(200).json({ order: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;