import { useEffect, useRef, useState } from "react";

export default function OurStory() {
  const [counters, setCounters] = useState({ pizzas: 0, cities: 0, team: 0 });
  const observerRef = useRef(null);

  // Counter animation
  useEffect(() => {
    const target = { pizzas: 5000, cities: 25, team: 50 };
    const step = { pizzas: 50, cities: 1, team: 1 };
    const interval = setInterval(() => {
      setCounters(prev => ({
        pizzas: Math.min(prev.pizzas + step.pizzas, target.pizzas),
        cities: Math.min(prev.cities + step.cities, target.cities),
        team: Math.min(prev.team + step.team, target.team),
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".animate-section").forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const timeline = [
    { year: "2018", title: "The Beginning", desc: "HeatTreat started from a small home kitchen with one recipe and a big dream." },
    { year: "2019", title: "First Outlet", desc: "Opened our first physical outlet in Surat — crowds lined up from day one." },
    { year: "2021", title: "Online Ordering", desc: "Launched our digital platform so fans could order from anywhere, anytime." },
    { year: "2023", title: "25 Cities", desc: "Expanded to 25 cities across India with 50+ passionate team members." },
    { year: "2025", title: "5000+ Pizzas", desc: "Served over 5000 happy customers and still growing strong." },
  ];

  return (
    <div className="ourstory-container">

      {/* Hero */}
      <section className="hero-ourstory">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Our Journey at HeatTreat</h1>
          <p className="hero-subtitle">From a small kitchen to delivering happiness in every slice.</p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="story-section animate-section">
        <div className="story-text">
          <h2>How It All Began</h2>
          <p>HeatTreat started in 2018 with a passion for authentic, fresh, and delicious pizzas. Our mission was simple – to make every pizza experience unforgettable.</p>
        </div>
      </section>

      <section className="story-section alt animate-section">
        <div className="story-text">
          <h2>Our Philosophy</h2>
          <p>We believe in using the freshest ingredients, handmade dough, and secret sauces that give every pizza the perfect taste. Customer happiness drives us.</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section animate-section">
        <h2 className="timeline-heading">Our Journey Timeline</h2>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-card">
                <span className="timeline-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Counters */}
      <section className="counters-section animate-section">
        <div className="counter">
          <h3>{counters.pizzas}+</h3>
          <p>Pizzas Served</p>
        </div>
        <div className="counter">
          <h3>{counters.cities}</h3>
          <p>Cities Delivered</p>
        </div>
        <div className="counter">
          <h3>{counters.team}+</h3>
          <p>Team Members</p>
        </div>
      </section>

      {/* Team */}
      <section className="team-section animate-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {[
            { name: "Rohit Sharma", role: "Head Chef", emoji: "👨‍🍳" },
            { name: "Anita Patel", role: "Co-Founder", emoji: "👩‍💼" },
            { name: "Vikram Desai", role: "Operations Head", emoji: "👨‍💼" },
          ].map((member, i) => (
            <div key={i} className="team-card">
              <div className="team-emoji">{member.emoji}</div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media */}
      <section className="social-section animate-section">
        <h2>Follow Us</h2>
        <p>Stay connected for deals, updates and pizza love 🍕</p>
        <div className="social-links">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn instagram">📸 Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn facebook">📘 Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn twitter">🐦 Twitter</a>
        </div>
      </section>

      {/* CTA */}
      <section className="story-cta animate-section">
        <h2>Ready for a Slice of Happiness?</h2>
        <a href="/home" className="cta-button">Order Your Pizza</a>
      </section>

    </div>
  );
}