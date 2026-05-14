import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState("");

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

  return (
    <div className="landing-container">
      <header className="header">
        <h1 className="logo">HeatTreat Pizza</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/story">Our Story</Link>
          <Link to="/contact">Contact</Link>
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        </nav>
      </header>

      <section
        className="hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)`,
        }}
      >
        <div className="hero-content">
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
            <button
              className="find-food-btn"
              onClick={() => navigate("/home")}
            >
              Explore Menu
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <h3>From Oven to Your Door</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <span>📍</span>
            <h4>Select Location</h4>
            <p>Choose your city and nearest HeatTreat outlet.</p>
          </div>
          <div className="feature-card">
            <span>🍕</span>
            <h4>Choose Your Pizza</h4>
            <p>Pick from classic, spicy, or chef’s special pizzas.</p>
          </div>
          <div className="feature-card">
            <span>🧀</span>
            <h4>Customize Toppings</h4>
            <p>Add cheese, veggies, sauces and make it perfect.</p>
          </div>
          <div className="feature-card">
            <span>💳</span>
            <h4>Pay Securely</h4>
            <p>Fast and safe payment with all digital methods.</p>
          </div>
          <div className="feature-card">
            <span>🔥</span>
            <h4>Freshly Baked</h4>
            <p>Your pizza is prepared hot and fresh by our chefs.</p>
          </div>
          <div className="feature-card">
            <span>🛵</span>
            <h4>Delivered Fast</h4>
            <p>Cheesy, hot and delicious at your doorstep.</p>
          </div>
        </div>
      </section>

      <section className="popular-mood" id="menu">
        <h3>Choose Your Craving 😋</h3>

        <div className="mood-buttons">
          {["cheesy", "spicy", "tangy", "garlicy"].map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={selectedMood === mood ? "active" : ""}
            >
              {mood === "cheesy"
                ? "🧀 Cheesy"
                : mood === "spicy"
                ? "🌶 Spicy"
                : mood === "tangy"
                ? "🍅 Tangy"
                : "🧄 Garlicy"}
            </button>
          ))}
          <button
            onClick={() => setSelectedMood("")}
            className={selectedMood === "" ? "active" : ""}
          >
            Show All
          </button>
        </div>

        <div className="featured-banner">
          <h4>Chef’s Pick</h4>
          <p>Try our signature Paneer Tandoori with smoky sauce and extra cheese.</p>
        </div>

        <div className="pizza-grid">
          {filteredPizzas.map((pizza, i) => (
            <div
              key={i}
              className={`pizza-card ${i === 0 ? "featured-card" : ""}`}
              onClick={() =>
                navigate("/home", {
                  state: { pizza },
                })
              }
            >
              <img src={pizza.img} alt={pizza.name} />
              <h4>{pizza.name}</h4>
              <p>{pizza.price}</p>

              <button
                className="order-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/login", { state: { pizza } });
                }}
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials">
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

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-sections">
            <div className="footer-section">
              <h4>About Us</h4>
              <ul>
                <li><Link to="/story">Our Story</Link></li>
              </ul>
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
                <li>Surat</li>
                <li>Ahmedabad</li>
                <li>Indore</li>
                <li>Mumbai</li>
              </ul>
            </div>
          </div>

          <div className="footer-apps">
            <p>Get the app:</p>
            <div className="app-badges">
              <a href="#"><img src={`${process.env.PUBLIC_URL}/apps/google-play-badge.png`} alt="Google Play" /></a>
              <a href="#"><img src={`${process.env.PUBLIC_URL}/apps/app-store-badge.png`} alt="App Store" /></a>
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