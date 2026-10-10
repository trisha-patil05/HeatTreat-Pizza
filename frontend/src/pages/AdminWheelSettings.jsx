import { useState, useEffect, useCallback } from "react";
import "./AdminWheelSettings.css";

const API_BASE = process.env.REACT_APP_API_BASE || "";

const COLOR_PRESETS = [
  "#FFB000", "#FF6B6B", "#4ECDC4", "#95E1D3", "#C7C7C7",
  "#A78BFA", "#60A5FA", "#F472B6", "#FBBF24", "#34D399",
];

export default function AdminWheelSettings() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  useEffect(() => {
    fetch(`${API_BASE}/api/wheel/admin/config`)
      .then((r) => r.json())
      .then((data) => setConfig(data.config))
      .catch((err) => console.error("Failed to load config:", err));
  }, []);

  const updatePrize = useCallback((index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      prizes: prev.prizes.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const addPrize = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        {
          label: "New Prize",
          type: "percentage",
          value: 5,
          weight: 10,
          color: COLOR_PRESETS[prev.prizes.length % COLOR_PRESETS.length],
        },
      ],
    }));
  }, []);

  const removePrize = useCallback((index) => {
    setConfig((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/wheel/admin/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      } else {
        setMessage({ type: "success", text: "Settings saved!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error — please try again." });
    } finally {
      setSaving(false);
    }
  }, [config]);

  if (!config) return <div className="aw-loading">Loading...</div>;

  const totalWeight = config.prizes.reduce((s, p) => s + Number(p.weight || 0), 0);

  return (
    <div className="aw-page">
      <div className="aw-header">
        <h1>Wheel Settings</h1>
        <button className="aw-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {message && <div className={`aw-banner aw-banner-${message.type}`}>{message.text}</div>}

      <div className="aw-card">
        <div className="aw-card-header">
          <h2>Prizes & Odds</h2>
          <span className={totalWeight === 0 ? "aw-weight-error" : "aw-weight"}>
            Total weight: {totalWeight}
          </span>
        </div>
        <p className="aw-hint">
          "Weight" controls how likely a prize is — higher number = more common.
          They don't need to add up to 100.
        </p>

        {config.prizes.map((prize, index) => (
          <div className="aw-prize-row" key={index}>
            <div className="aw-field">
              <label>Label</label>
              <input
                type="text"
                value={prize.label}
                onChange={(e) => updatePrize(index, "label", e.target.value)}
              />
            </div>
            <div className="aw-field">
              <label>Type</label>
              <select
                value={prize.type}
                onChange={(e) => updatePrize(index, "type", e.target.value)}
              >
                <option value="percentage">Percentage discount</option>
                <option value="free_item">Free item</option>
                <option value="none">No prize (try again)</option>
              </select>
            </div>
            {prize.type === "percentage" && (
              <div className="aw-field aw-field-small">
                <label>% off</label>
                <input
                  type="number"
                  value={prize.value}
                  onChange={(e) => updatePrize(index, "value", Number(e.target.value))}
                />
              </div>
            )}
            <div className="aw-field aw-field-small">
              <label>Weight</label>
              <input
                type="number"
                value={prize.weight}
                onChange={(e) => updatePrize(index, "weight", Number(e.target.value))}
              />
            </div>
            <div className="aw-field">
              <label>Color</label>
              <select
                value={prize.color}
                onChange={(e) => updatePrize(index, "color", e.target.value)}
              >
                {COLOR_PRESETS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="aw-remove-btn"
              onClick={() => removePrize(index)}
              disabled={config.prizes.length <= 1}
              aria-label="Remove prize"
            >
              ✕
            </button>
          </div>
        ))}

        <button className="aw-add-btn" onClick={addPrize}>
          + Add prize
        </button>
      </div>

      <div className="aw-card">
        <h2>Popup behavior</h2>
        <div className="aw-field-row">
          <label>Delay before popup shows (seconds)</label>
          <input
            type="number"
            min={0}
            max={30}
            value={config.popupDelaySeconds}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, popupDelaySeconds: Number(e.target.value) }))
            }
          />
        </div>
        <div className="aw-field-row">
          <label>Coupon valid for (days)</label>
          <input
            type="number"
            min={1}
            value={config.couponValidDays}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, couponValidDays: Number(e.target.value) }))
            }
          />
        </div>
        <div className="aw-checkbox-row">
          <input
            type="checkbox"
            id="showOnce"
            checked={config.showOncePerVisitor}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, showOncePerVisitor: e.target.checked }))
            }
          />
          <label htmlFor="showOnce">Show only once per visitor</label>
        </div>
        <div className="aw-checkbox-row">
          <input
            type="checkbox"
            id="isActive"
            checked={config.isActive}
            onChange={(e) => setConfig((prev) => ({ ...prev, isActive: e.target.checked }))}
          />
          <label htmlFor="isActive">Wheel is active on storefront</label>
        </div>
      </div>
    </div>
  );
}
