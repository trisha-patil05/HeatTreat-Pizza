import { useState } from "react";

export default function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* Header */}
        <div className="contact-header animate-section">
          <h2>📞 Contact Us</h2>
          <p>Have a question or feedback? We'd love to hear from you!</p>
        </div>

        <div className="contact-grid animate-section">

          {/* Form */}
          <div className="contact-form">
            <h3>Send us a Message</h3>

            {submitted ? (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "12px"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                <h4 style={{ color: "#10b981", marginBottom: "8px" }}>Message Sent!</h4>
                <p style={{ color: "#888", fontSize: "14px" }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input type="text" placeholder="Trisha Patil" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="trisha@email.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" placeholder="Order issue / Feedback / Other" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows={5} placeholder="Write your message here..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", padding: "13px" }} disabled={loading}>
                  {loading ? "⏳ Sending..." : "📨 Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="contact-info animate-section">
            {[
              { icon: "📍", title: "Our Location",    text: "123 Pizza Street, Surat, Gujarat 395001" },
              { icon: "📞", title: "Phone Number",    text: "+91 9876543210"                            },
              { icon: "📧", title: "Email Address",   text: "support@heattreat.com"                    },
              { icon: "🕐", title: "Working Hours",   text: "Mon-Sun: 10:00 AM – 11:00 PM"            },
              { icon: "🛵", title: "Delivery Hours",  text: "11:00 AM – 10:30 PM Daily"               },
            ].map((info, i) => (
              <div className="contact-info-card" key={i}>
                <div className="contact-icon">{info.icon}</div>
                <div>
                  <h4>{info.title}</h4>
                  <p>{info.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}