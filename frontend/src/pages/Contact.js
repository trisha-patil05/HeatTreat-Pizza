import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been submitted.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact HeatTreat</h1>
      </header>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <p>Have questions or feedback? Send us a message and we’ll get back to you soon!</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            required
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            required
          />
          <textarea 
            name="message" 
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange} 
            rows="5" 
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      <footer className="contact-footer">
        <p>© 2025 HeatTreat Pizza | Made with ❤️ & 🍕</p>
      </footer>
    </div>
  );
}
