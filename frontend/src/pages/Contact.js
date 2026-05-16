import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    showToast("✅ Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
  };

  return (
    <div className="contact-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="contact-box">
        <h2 className="page-title">Get in Touch</h2>
        <p className="page-subtitle">Have questions or feedback? We'd love to hear from you!</p>

        {/* Store Info */}
        <div className="store-info-grid">
          <div className="store-info-card">
            <span>📍</span>
            <div>
              <h4>Address</h4>
              <p>HeatTreat HQ, Main Branch, Surat, Gujarat</p>
            </div>
          </div>
          <div className="store-info-card">
            <span>📞</span>
            <div>
              <h4>Phone</h4>
              <p>+91 9876543210</p>
            </div>
          </div>
          <div className="store-info-card">
            <span>🕐</span>
            <div>
              <h4>Store Timings</h4>
              <p>Mon–Sun: 10:00 AM – 11:00 PM</p>
            </div>
          </div>
          <div className="store-info-card">
            <span>✉️</span>
            <div>
              <h4>Email</h4>
              <p>support@heattreat.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div>
            <input
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <textarea
              className={`input-field ${errors.message ? 'input-error' : ''}`}
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
            />
            {errors.message && <p className="field-error">{errors.message}</p>}
          </div>

          <button className="btn-primary" type="submit">Send Message</button>
        </form>

        {/* Social Media */}
        <div className="contact-social">
          <p>Follow us on social media</p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn instagram">📸 Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn facebook">📘 Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn twitter">🐦 Twitter</a>
          </div>
        </div>
      </div>

      <p className="contact-footer-text">© 2025 HeatTreat Pizza | Made with ❤️ & 🍕</p>
    </div>
  );
}