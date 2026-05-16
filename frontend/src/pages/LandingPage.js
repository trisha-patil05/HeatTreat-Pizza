import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [toast, setToast] = useState("");

  const popularPizzas = [
    { name: "Cheese Burst", price: "₹299", img: "/pizzas/29.jpg", mood: "cheesy" },
    { name: "Peri Peri Veg", price: "₹349", img: "/pizzas/30.jpg", mood: "spicy" },
    { name: "Paneer Tandoori", price: "₹399", img: "/pizzas/31.jpg", mood: "tangy" },
    { name: "Garlic Lovers", price: "₹369", img: "/pizzas/32.jpg", mood: "garlicy" },
    { name: "Margherita", price: "₹279", img: "/pizzas/1.jpeg", mood: "cheesy" },
  ];

  const testimonials = [
    { text: "Best pizza in town! Crust was perfect and delivery was quick!", name: "Riya Shah" },
    { text: "Love their Peri Peri flavor! Totally recommend HeatTreat!", name: "Aryan Mehta" },
  ];

  const filteredPizzas =
    selectedMood === ""
      ? popularPizzas
      : popularPizzas.filter((pizza) => pizza.mood === selectedMood);

  // Scroll animation
  const observerRef = useRef(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".animate-section").forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast("🎉 Subscribed successfully!");
    setEmail("");
  };

  return (
    <div className="landing-container">

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Hero */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)` }}
      >
        <div className="hero-content animate-hero">
          <h2 className="hero-title">Hot. Fresh. Loaded.</h2>
          <p className="hero-subtitle">
            Build your perfect pizza and get it delivered hot from HeatTreat.
          </p>
          <div className="search-box">
            <select>
              <option>Select City</option>
              <option>Surat</option>
              <option>Ahmedabad</option>
              <option>Indore</option>
            </select>
            <select>
              <option>Select Outlet</option>
              <option>Main Branch</option>
              <option>Central Mall</option>
            </select>
            <button className="find-food-btn" onClick={() => navigate("/home")}>
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features animate-section">
        <h3>From Oven to Your Door</h3>
        <div className="feature-grid">
          {[
            { icon: "📍", title: "Select Location", desc: "Choose your city and nearest HeatTreat outlet." },
            { icon: "🍕", title: "Choose Your Pizza", desc: "Pick from classic, spicy, or chef's special pizzas." },
            { icon: "🧀", title: "Customize Toppings", desc: "Add cheese, veggies, sauces and make it perfect." },
            { icon: "💳", title: "Pay Securely", desc: "Fast and safe payment with all digital methods." },
            { icon: "🔥", title: "Freshly Baked", desc: "Your pizza is prepared hot and fresh by our chefs." },
            { icon: "🛵", title: "Delivered Fast", desc: "Cheesy, hot and delicious at your doorstep." },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <span>{f.icon}</span>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mood Picker */}
      <section className="popular-mood animate-section" id="menu">
        <h3>Choose Your Craving 😋</h3>
        <div className="mood-buttons">
          {["cheesy", "spicy", "tangy", "garlicy"].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={selectedMood === mood ? "active" : ""}
            >
              {mood === "cheesy" ? "🧀 Cheesy" : mood === "spicy" ? "🌶 Spicy" : mood === "tangy" ? "🍅 Tangy" : "🧄 Garlicy"}
            </button>
          ))}
          <button onClick={() => setSelectedMood("")} className={selectedMood === "" ? "active" : ""}>
            Show All
          </button>
        </div>

        <div className="featured-banner">
          <h4>Chef's Pick</h4>
          <p>Try our signature Paneer Tandoori with smoky sauce and extra cheese.</p>
        </div>

        <div className="pizza-grid">
          {filteredPizzas.map((pizza, i) => (
            <div
              key={i}
              className={`pizza-card ${i === 0 ? "featured-card" : ""}`}
              onClick={() => navigate("/home", { state: { pizza } })}
            >
              <img src={pizza.img} alt={pizza.name} />
              <h4>{pizza.name}</h4>
              <p>{pizza.price}</p>
              <button
                className="order-btn"
                onClick={(e) => { e.stopPropagation(); navigate("/login", { state: { pizza } }); }}
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials animate-section">
        <h3>Loved by Pizza Fans</h3>
        <div className="review-grid">
          {testimonials.map((review, i) => (
            <div key={i} className="review">
              <p>"{review.text}"</p>
              <h5>– {review.name}</h5>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section animate-section">
        <div className="newsletter-box">
          <h3>🍕 Get Exclusive Deals!</h3>
          <p>Subscribe to our newsletter and get 10% off your first order.</p>
          {subscribed ? (
            <p className="subscribed-msg">✅ You're subscribed! Check your inbox soon.</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-sections">
            <div className="footer-section">
              <h4>About Us</h4>
              <ul><li><Link to="/story">Our Story</Link></li></ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>Email: support@heattreat.com</li>
                <li>Phone: +91 9876543210</li>
                <li><Link to="/contact">Contact Form</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Delivery Locations</h4>
              <ul>
                <li>Surat</li><li>Ahmedabad</li><li>Indore</li><li>Mumbai</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 HeatTreat Pizza | Made with ❤️ & 🍕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}