const nodemailer = require("nodemailer");

// ── Transporter Setup ──
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "05amtics036@gmail.com",
    pass: "plswsosvnonybsnt", // App Password
  },
});

// ── Order Confirmation Email ──
const sendOrderConfirmationEmail = async (toEmail, orderData) => {
  const { orderId, cartItems, totalAmount, address, payment } = orderData;

  const itemsHTML = cartItems.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#f1f5f9">${item.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#94a3b8;text-align:center">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#f97316;text-align:right">₹${item.price * item.quantity}</td>
    </tr>
  `).join("");

  const paymentLabel =
    payment === "cash" ? "💵 Cash on Delivery" :
    payment === "card" ? "💳 Credit/Debit Card" :
    payment === "upi"  ? "📱 UPI" : payment;

  const mailOptions = {
    from: `"🍕 HeatTreat Pizza" <05amtics036@gmail.com>`,
    to: toEmail,
    subject: `✅ Order Confirmed! #${String(orderId).slice(-8).toUpperCase()}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:20px">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1d28,#0f1117);border:1px solid #2a2d3e;border-radius:16px;padding:32px;text-align:center;margin-bottom:20px">
      <div style="font-size:48px;margin-bottom:12px">🍕</div>
      <h1 style="color:#f97316;margin:0;font-size:28px;font-weight:700">HeatTreat Pizza</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:14px">Your order is confirmed!</p>
    </div>

    <!-- Success Banner -->
    <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:20px;text-align:center;margin-bottom:20px">
      <div style="font-size:32px;margin-bottom:8px">✅</div>
      <h2 style="color:#10b981;margin:0;font-size:20px">Order Placed Successfully!</h2>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:14px">
        Order ID: <strong style="color:#f97316;font-family:monospace">#${String(orderId).slice(-8).toUpperCase()}</strong>
      </p>
    </div>

    <!-- Order Details -->
    <div style="background:#1a1d28;border:1px solid #2a2d3e;border-radius:12px;padding:24px;margin-bottom:20px">
      <h3 style="color:#f1f5f9;margin:0 0 16px;font-size:16px">🛒 Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#0f1117">
            <th style="padding:8px 12px;text-align:left;color:#64748b;font-size:12px;text-transform:uppercase">Item</th>
            <th style="padding:8px 12px;text-align:center;color:#64748b;font-size:12px;text-transform:uppercase">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#64748b;font-size:12px;text-transform:uppercase">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Bill -->
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #2a2d3e">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#94a3b8;font-size:14px">Grand Total</span>
          <strong style="color:#f97316;font-size:18px">₹${totalAmount}</strong>
        </div>
      </div>
    </div>

    <!-- Delivery Info -->
    <div style="background:#1a1d28;border:1px solid #2a2d3e;border-radius:12px;padding:24px;margin-bottom:20px">
      <h3 style="color:#f1f5f9;margin:0 0 16px;font-size:16px">📍 Delivery Information</h3>
      <table style="width:100%">
        <tr>
          <td style="color:#64748b;font-size:13px;padding:6px 0">Address</td>
          <td style="color:#f1f5f9;font-size:13px;text-align:right">${address}</td>
        </tr>
        <tr>
          <td style="color:#64748b;font-size:13px;padding:6px 0">Payment</td>
          <td style="color:#f1f5f9;font-size:13px;text-align:right">${paymentLabel}</td>
        </tr>
        <tr>
          <td style="color:#64748b;font-size:13px;padding:6px 0">Est. Delivery</td>
          <td style="color:#10b981;font-size:13px;text-align:right">🕐 30–45 minutes</td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px">
      <p style="color:#64748b;font-size:13px;margin:0">
        Thank you for ordering with <strong style="color:#f97316">HeatTreat Pizza</strong>! 🔥
      </p>
      <p style="color:#64748b;font-size:12px;margin:8px 0 0">
        Koi problem? Reply to this email.
      </p>
    </div>

  </div>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent to:", toEmail);
    return true;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    return false;
  }
};

// ── Order Status Update Email ──
const sendStatusUpdateEmail = async (toEmail, orderData) => {
  const { orderId, status } = orderData;

  const statusEmoji = {
    "Preparing":         "👨‍🍳",
    "Out for Delivery":  "🛵",
    "Delivered":         "✅",
    "Cancelled":         "❌",
  };

  const statusColor = {
    "Preparing":         "#f59e0b",
    "Out for Delivery":  "#3b82f6",
    "Delivered":         "#10b981",
    "Cancelled":         "#ef4444",
  };

  const emoji = statusEmoji[status] || "📦";
  const color = statusColor[status] || "#f97316";

  const mailOptions = {
    from: `"🍕 HeatTreat Pizza" <05amtics036@gmail.com>`,
    to: toEmail,
    subject: `${emoji} Order Update — ${status} | #${String(orderId).slice(-8).toUpperCase()}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f1117;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:500px;margin:0 auto;padding:20px">

    <div style="background:#1a1d28;border:1px solid #2a2d3e;border-radius:16px;padding:32px;text-align:center">
      <div style="font-size:56px;margin-bottom:16px">${emoji}</div>
      <h2 style="color:${color};margin:0;font-size:24px">${status}!</h2>
      <p style="color:#94a3b8;margin:12px 0;font-size:14px">
        Your order <strong style="color:#f97316;font-family:monospace">#${String(orderId).slice(-8).toUpperCase()}</strong>
        is now <strong style="color:${color}">${status}</strong>
      </p>
      ${status === "Delivered" ? `
        <div style="margin-top:20px;padding:16px;background:rgba(16,185,129,0.1);border-radius:8px">
          <p style="color:#10b981;margin:0;font-size:14px">🎉 Enjoy your pizza! Thank you for ordering with HeatTreat Pizza!</p>
        </div>
      ` : ""}
      ${status === "Out for Delivery" ? `
        <div style="margin-top:20px;padding:16px;background:rgba(59,130,246,0.1);border-radius:8px">
          <p style="color:#3b82f6;margin:0;font-size:14px">🛵 Our delivery partner is on the way! Expected in 15–20 minutes.</p>
        </div>
      ` : ""}
    </div>

    <div style="text-align:center;padding:16px">
      <p style="color:#64748b;font-size:12px;margin:0">HeatTreat Pizza 🍕 — Fast Delivery within 30 Minutes!</p>
    </div>
  </div>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Status update email sent:", status, "to:", toEmail);
    return true;
  } catch (err) {
    console.error("❌ Status email failed:", err.message);
    return false;
  }
};

module.exports = { sendOrderConfirmationEmail, sendStatusUpdateEmail };