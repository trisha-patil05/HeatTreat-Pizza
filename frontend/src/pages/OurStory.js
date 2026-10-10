import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OurStory() {
  const navigate = useNavigate();

  const observerRef = useRef(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".animate-section").forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="story-page">

      {/* Hero */}
      <section className="story-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background/background2.jpg)` }}>
        <div className="story-hero-content">
          <h1>Our Story 🍕</h1>
          <p>From a small kitchen dream to your doorstep</p>
        </div>
      </section>

      <div className="story-content">

        {/* Origin */}
        <div className="story-section animate-section">
          <h2>🔥 How It Started</h2>
          <p>
            HeatTreat Pizza was born in 2020 from a simple love of great food.
            What started as a home kitchen experiment quickly became a passion project —
            crafting pizzas with the finest ingredients, bold flavors, and a whole lot of heart.
            Today, we deliver that same love to your doorstep.
          </p>
        </div>

        {/* Values */}
        <div className="story-section animate-section">
          <h2>💡 What We Stand For</h2>
          <div className="story-values">
            {[
              { icon: "🌿", title: "Fresh Ingredients",  desc: "We source only the freshest produce and finest cheeses every single day."   },
              { icon: "🔥", title: "Made with Passion",  desc: "Every pizza is crafted with care and love — never rushed, always perfect."   },
              { icon: "🛵", title: "Fast Delivery",      desc: "Hot pizza at your door in 30 minutes or less. Always."                        },
              { icon: "🧀", title: "Bold Flavors",       desc: "From classic margherita to spicy specials — there's a pizza for every mood." },
              { icon: "💚", title: "Community First",    desc: "We give back to our community and support local farmers and suppliers."        },
              { icon: "⭐", title: "Customer Delight",   desc: "Your satisfaction is our biggest reward. Every order, every time."             },
            ].map((v, i) => (
              <div className="story-value-card" key={i}>
                <span>{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="story-section animate-section">
          <h2>📅 Our Journey</h2>
          <div className="story-timeline">
            {[
              { year: "2020", text: "Started from a home kitchen — first 10 customers were family and friends." },
              { year: "2021", text: "Opened our first outlet in Surat. 500+ orders in the first month!"         },
              { year: "2022", text: "Launched our online ordering platform — making pizza even more accessible."  },
              { year: "2023", text: "Expanded to 4 cities — Surat, Ahmedabad, Indore and Mumbai."                },
              { year: "2024", text: "10,000+ happy customers and counting. Thank you for the love! 🙏"           },
            ].map((t, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-text">{t.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="story-section animate-section">
          <h2>👨‍🍳 Meet the Team</h2>
          <div className="story-team">
            {[
              { avatar: "👨‍🍳", name: "Rahul Sharma",  role: "Head Chef & Founder"    },
              { avatar: "👩‍💼", name: "Priya Patel",   role: "Operations Manager"      },
              { avatar: "👨‍💻", name: "Aman Verma",    role: "Tech & Delivery Lead"    },
              { avatar: "👩‍🍳", name: "Sneha Joshi",   role: "Recipe Developer"        },
            ].map((m, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">{m.avatar}</div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="story-section animate-section" style={{ textAlign: "center" }}>
          <h2>🍕 Ready to Order?</h2>
          <p style={{ color: "#bbb", marginBottom: "24px" }}>Join thousands of happy customers — your perfect pizza is just a click away.</p>
          <button className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}
            onClick={() => navigate("/home")}>
            Explore Our Menu
          </button>
        </div>

      </div>
    </div>
  );
}