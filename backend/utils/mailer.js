const nodemailer = require("nodemailer");

// Works with Gmail, Outlook, or any SMTP provider. For Gmail, you need an
// "App Password" (not your regular password) — generate one at
// https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendCouponEmail({ to, prizeLabel, couponCode }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP_USER/SMTP_PASS not set — skipping email send (dev mode).");
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Pizza App" <${process.env.SMTP_USER}>`,
    to,
    subject: `You won ${prizeLabel}! 🍕`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Congrats! You won ${prizeLabel}</h2>
        <p>Use the code below at checkout:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; background: #f4f4f4; padding: 12px 20px; text-align: center; border-radius: 8px;">
          ${couponCode}
        </p>
        <p style="color: #888; font-size: 13px;">This code can only be used once and expires soon, so use it fast!</p>
      </div>
    `,
  });
}

module.exports = { sendCouponEmail };
