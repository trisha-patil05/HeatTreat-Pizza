import { useState, useEffect } from "react";
import "./AdminWinners.css";

const API_BASE = process.env.REACT_APP_API_BASE || "";

export default function AdminWinners() {
  const [entries, setEntries] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/wheel/admin/entries`)
      .then((r) => r.json())
      .then((data) => setEntries(data.entries))
      .catch((err) => console.error("Failed to load entries:", err));

    fetch(`${API_BASE}/api/wheel/admin/stats`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  const winRate =
    stats && stats.totalSpins > 0
      ? ((stats.totalWins / stats.totalSpins) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="awn-page">
      <h1>Spin Wheel — Winners</h1>

      {stats && (
        <div className="awn-stats">
          <div className="awn-stat-card">
            <span className="awn-stat-label">Total Spins</span>
            <span className="awn-stat-value">{stats.totalSpins}</span>
          </div>
          <div className="awn-stat-card">
            <span className="awn-stat-label">Coupons Won</span>
            <span className="awn-stat-value">{stats.totalWins}</span>
          </div>
          <div className="awn-stat-card">
            <span className="awn-stat-label">Win Rate</span>
            <span className="awn-stat-value">{winRate}%</span>
          </div>
        </div>
      )}

      {entries === null ? (
        <p className="awn-loading">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="awn-empty">No spins yet.</p>
      ) : (
        <table className="awn-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Prize</th>
              <th>Coupon Code</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.email}</td>
                <td>{entry.prizeLabel}</td>
                <td>{entry.couponCode || "—"}</td>
                <td>
                  {!entry.couponCode ? (
                    <span className="awn-badge">No prize</span>
                  ) : entry.isRedeemed ? (
                    <span className="awn-badge awn-badge-used">Redeemed</span>
                  ) : (
                    <span className="awn-badge awn-badge-active">Active</span>
                  )}
                </td>
                <td>{new Date(entry.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
