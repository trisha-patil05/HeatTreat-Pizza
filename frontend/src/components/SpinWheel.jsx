import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./SpinWheel.css";

// Set this to wherever your backend runs, e.g. "http://localhost:5000" in
// dev, or leave as "" if the API is served from the same domain as the
// React app in production.
const API_BASE = process.env.REACT_APP_API_BASE || "";
const STORAGE_KEY = "pizza_spin_has_spun";

export default function SpinWheel() {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [email, setEmail] = useState(user?.email || "");
  const [status, setStatus] = useState("idle"); // idle | spinning | done
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleCopy = useCallback(() => {
    if (!result?.couponCode) return;
    navigator.clipboard.writeText(result.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  // Load config on mount, decide whether/when to show the popup.
   useEffect(() => {
    fetch(`${API_BASE}/api/wheel/config`)
      .then((r) => r.json())
      .then(async (data) => {
        if (!data.isActive) return;
        setPrizes(data.prizes);

        if (user?.email) {
          if (data.showOncePerVisitor) {
            try {
              const res = await fetch(
                `${API_BASE}/api/wheel/has-spun?email=${encodeURIComponent(user.email)}`
              );
              const check = await res.json();
              if (check.hasSpun) return;
            } catch (err) {
              console.error("has-spun check failed:", err);
            }
          }
        } else {
          const alreadySpun = data.showOncePerVisitor && localStorage.getItem(STORAGE_KEY);
          if (alreadySpun) return;
        }

        const timer = setTimeout(() => setVisible(true), (data.popupDelaySeconds || 5) * 1000);
        return () => clearTimeout(timer);
      })
      .catch((err) => console.error("Failed to load wheel config:", err));
  }, [user]);

  // Draw the wheel whenever prizes are loaded.
    useEffect(() => {
    if (!prizes.length || !visible || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const radius = 130;
    const anglePer = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, 260, 260);
    prizes.forEach((prize, i) => {
      const start = i * anglePer;
      const end = start + anglePer;

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = prize.color || "#cccccc";
      ctx.fill();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(start + anglePer / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(prize.label, radius - 12, 4);
      ctx.restore();
    });
    }, [prizes, visible]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setStatus("spinning");

      try {
        const res = await fetch(`${API_BASE}/api/wheel/spin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong. Try again.");
          setStatus("idle");
          return;
        }

        const anglePer = 360 / prizes.length;
        const index = data.prizeIndex >= 0 ? data.prizeIndex : 0;
        const targetAngle = 360 * 5 + (360 - (index * anglePer + anglePer / 2));
        setRotation((prev) => prev + targetAngle);

                setTimeout(() => {
          setResult(data);
          setStatus("done");
          if (!user?.email) {
            localStorage.setItem(STORAGE_KEY, "1");
          }
          if (data.couponCode) {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
            });
          }
        }, 4700);
      } catch (err) {
        console.error(err);
        setError("Network error — please try again.");
        setStatus("idle");
      }
    },
       [email, prizes, user]
  );

  if (!visible) return null;

  return (
    <div className="sw-overlay sw-visible">
      <div className="sw-modal">
        <button className="sw-close" onClick={() => setVisible(false)} aria-label="Close">
          &times;
        </button>
        <p className="sw-title">Spin to Win!</p>
        <p className="sw-subtitle">Enter your email for a chance at a discount</p>

        <div className="sw-wheel-wrap">
          <div className="sw-pointer" />
          <canvas
            ref={canvasRef}
            id="sw-canvas"
            width={260}
            height={260}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>

        {status !== "done" ? (
          <form className="sw-form" onSubmit={handleSubmit}>
              <input
              className="sw-email-input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={Boolean(user?.email)}
              required

            />
            <button className="sw-spin-btn" type="submit" disabled={status === "spinning"}>
              {status === "spinning" ? "Spinning..." : "Spin the Wheel"}
            </button>
            {error && <p className="sw-message">{error}</p>}
          </form>
        ) : (
          <div className="sw-result">
            <p className="sw-title">
              {result?.couponCode ? `You won ${result.prizeLabel}!` : "Better luck next time!"}
            </p>
            {result?.couponCode && (
              <>
                <div className="sw-result-code">{result.couponCode}</div>
                <button className="sw-copy-btn" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </>
            )}
            <p className="sw-subtitle">
              {result?.couponCode
                ? "Use this code at checkout. We've also emailed it to you."
                : "Check back for more offers soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
