import { useEffect, useState } from "react";
import "./OurStory.css";

export default function OurStory() {
  const [counters, setCounters] = useState({ pizzas: 0, cities: 0, team: 0 });

  // Simple counter animation
  useEffect(() => {
    const target = { pizzas: 5000, cities: 25, team: 50 };
    let step = { pizzas: 50, cities: 1, team: 1 };

    const interval = setInterval(() => {
      setCounters(prev => ({
        pizzas: Math.min(prev.pizzas + step.pizzas, target.pizzas),
        cities: Math.min(prev.cities + step.cities, target.cities),
        team: Math.min(prev.team + step.team, target.team)
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ourstory-container">

      {/* Hero Section */}
      <section className="hero-ourstory">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Our Journey at HeatTreat</h1>
          <p className="hero-subtitle">
            From a small kitchen to delivering happiness in every slice.
          </p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="story-section">
        <div className="story-text">
          <h2>How It All Began</h2>
          <p>
            HeatTreat started in 2018 with a passion for authentic, fresh, and delicious pizzas. 
            Our mission was simple – to make every pizza experience unforgettable.
          </p>
        </div>
      </section>

      <section className="story-section alt">
        <div className="story-text">
          <h2>Our Philosophy</h2>
          <p>
            We believe in using the freshest ingredients, handmade dough, and secret sauces that 
            give every pizza the perfect taste. Customer happiness drives us.
          </p>
        </div>
      </section>

      {/* Fun Counters */}
      <section className="counters-section">
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

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <h4>Rohit Sharma</h4>
            <p>Head Chef</p>
          </div>
          <div className="team-card">
            <h4>Anita Patel</h4>
            <p>Co-Founder</p>
          </div>
          <div className="team-card">
            <h4>Vikram Desai</h4>
            <p>Operations Head</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="story-cta">
        <h2>Ready for a Slice of Happiness?</h2>
        <a href="/order" className="cta-button">Order Your Pizza</a>
      </section>

    </div>
  );
}
