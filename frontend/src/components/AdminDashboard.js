import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TABS = ["Overview", "Pizzas", "Orders", "Users"];

const initialPizzas = [
  { id: 1, name: "Margherita",   price: 200, category: "Veg",     available: true  },
  { id: 2, name: "Pepperoni",    price: 250, category: "Non-Veg", available: true  },
  { id: 3, name: "Paneer Tikka", price: 260, category: "Veg",     available: true  },
  { id: 4, name: "BBQ Chicken",  price: 270, category: "Non-Veg", available: false },
  { id: 5, name: "Four Cheese",  price: 280, category: "Veg",     available: true  },
];

const STATUS_COLORS = {
  Placed:              "#a78bfa",
  Preparing:           "#ff6600",
  "Out for Delivery":  "#3b82f6",
  Delivered:           "#10b981",
  Cancelled:           "#ef4444",
};

export default function AdminDashboard() {
  const navigate  = useNavigate();
  const getUser   = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
  const getToken  = () => localStorage.getItem('token');

  const [activeTab, setActiveTab]   = useState("Overview");
  const [pizzas, setPizzas]         = useState(initialPizzas);
  const [newPizza, setNewPizza]     = useState({ name: "", price: "", category: "Veg" });
  const [showForm, setShowForm]     = useState(false);
  const [toast, setToast]           = useState("");

  const [orders, setOrders]         = useState([]);
  const [ordersLoading, setOL]      = useState(false);
  const [users, setUsers]           = useState([]);
  const [usersLoading, setUL]       = useState(false);
  const [stats, setStats]           = useState({ revenue: 0, total: 0, pending: 0, users: 0 });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchOrders = useCallback(async () => {
    setOL(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/orders/all", { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      const list = data.orders || [];
      setOrders(list);
      setStats(prev => ({
  ...prev,
  revenue: list
    .filter(o => o.status === "Delivered")
    .reduce((s, o) => s + o.totalAmount, 0),
  total: list.length,
  pending: list.filter(
    o => !["Delivered", "Cancelled"].includes(o.status)
  ).length
}));
    } catch (e) { console.error(e); }
    finally { setOL(false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUL(true);
    try {
      const res  = await fetch("https://heattreat-backend.onrender.com/api/auth/users", { headers: { Authorization: `Bearer ${getToken()}` } });
      const data = await res.json();
      setUsers(data.users || []);
      setStats(s => ({ ...s, users: (data.users || []).length }));
    } catch (e) { console.error(e); }
    finally { setUL(false); }
  }, []);

  useEffect(() => {
  if (activeTab === "Overview" || activeTab === "Orders") {
    fetchOrders();
  }

  if (activeTab === "Overview" || activeTab === "Users") {
    fetchUsers();
  }
}, [activeTab, fetchOrders, fetchUsers]);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`https://heattreat-backend.onrender.com/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status })
      });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      showToast("✅ Status updated!");
    } catch { showToast("❌ Update failed"); }
  };

  const handleAddPizza = () => {
    if (!newPizza.name || !newPizza.price) { showToast("⚠️ Fill all fields"); return; }
    setPizzas(prev => [...prev, { id: Date.now(), name: newPizza.name, price: +newPizza.price, category: newPizza.category, available: true }]);
    setNewPizza({ name: "", price: "", category: "Veg" });
    setShowForm(false);
    showToast("✅ Pizza added!");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    navigate('/');
  };

  const user = getUser();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-main)", fontFamily: "var(--font)" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#1a1a1a", border: "1px solid var(--orange)", color: "var(--orange)", padding: "12px 20px", borderRadius: "10px", zIndex: 9999, fontWeight: 600 }}>
          {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#0d0d0d", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--orange)" }}>🍕 HeatTreat</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {TABS.map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "11px 14px", border: "none", borderRadius: "8px",
                cursor: "pointer", fontSize: "14px", fontWeight: 500,
                fontFamily: "var(--font)", textAlign: "left", width: "100%",
                background: activeTab === tab ? "rgba(255,102,0,0.12)" : "transparent",
                color: activeTab === tab ? "var(--orange)" : "var(--text-muted)",
                transition: "all 0.2s"
              }}>
              {tab === "Overview" ? "📊" : tab === "Pizzas" ? "🍕" : tab === "Orders" ? "📦" : "👥"} {tab}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-white)", marginBottom: "4px" }}>{user?.name || "Admin"}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "12px" }}>Super Admin</div>
          <button onClick={handleLogout}
            style={{ width: "100%", padding: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#ef4444", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <header style={{ padding: "20px 32px", borderBottom: "1px solid var(--border)", background: "#0d0d0d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "var(--text-white)", fontSize: "1.3rem", fontWeight: 700 }}>
              {activeTab === "Overview" ? "📊" : activeTab === "Pizzas" ? "🍕" : activeTab === "Orders" ? "📦" : "👥"} {activeTab}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </header>

        <div style={{ padding: "28px 32px", flex: 1 }}>

          {/* ── OVERVIEW ── */}
          {activeTab === "Overview" && (
            <div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px" }}>
                {[
                  { icon: "💰", label: "Revenue",       value: `₹${stats.revenue}`, color: "#10b981" },
                  { icon: "📦", label: "Total Orders",  value: stats.total,          color: "#3b82f6" },
                  { icon: "⏳", label: "Active Orders", value: stats.pending,         color: "var(--orange)" },
                  { icon: "👥", label: "Total Users",   value: stats.users,           color: "#a78bfa" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "14px", borderTop: `3px solid ${s.color}` }}>
                    <span style={{ fontSize: "28px" }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-white)" }}>{s.value}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ color: "var(--text-white)", fontSize: "15px", fontWeight: 600, marginBottom: "16px" }}>Recent Orders</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Order ID","User","Total","Status","Time"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o._id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "12px", color: "var(--orange)" }}>#{o._id?.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: "12px", fontSize: "13px", color: "var(--text-white)" }}>{o.user?.username || "—"}</td>
                        <td style={{ padding: "12px", fontSize: "13px", color: "#10b981", fontWeight: 600 }}>₹{o.totalAmount}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ background: (STATUS_COLORS[o.status] || "#888") + "22", color: STATUS_COLORS[o.status] || "#888", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                          {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PIZZAS ── */}
          {activeTab === "Pizzas" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "var(--text-white)", fontWeight: 600 }}>Pizza Menu ({pizzas.length})</h3>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "✕ Cancel" : "+ Add Pizza"}
                </button>
              </div>

              {showForm && (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--orange)", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
                  <h4 style={{ color: "var(--orange)", marginBottom: "16px" }}>Add New Pizza</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>PIZZA NAME</label>
                      <input className="input-field" type="text" placeholder="e.g. Spicy Veggie"
                        value={newPizza.name} onChange={e => setNewPizza({ ...newPizza, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>PRICE (₹)</label>
                      <input className="input-field" type="number" placeholder="e.g. 299"
                        value={newPizza.price} onChange={e => setNewPizza({ ...newPizza, price: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>CATEGORY</label>
                      <select className="input-field" value={newPizza.category} onChange={e => setNewPizza({ ...newPizza, category: e.target.value })}>
                        <option>Veg</option><option>Non-Veg</option><option>Spicy</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleAddPizza}>Add Pizza</button>
                </div>
              )}

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#0d0d0d" }}>
                      {["#","Name","Price","Category","Available","Action"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pizzas.map((p, i) => (
                      <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                        <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{i + 1}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-white)", fontSize: "14px" }}>{p.name}</td>
                        <td style={{ padding: "12px 16px", color: "var(--orange)", fontWeight: 600 }}>₹{p.price}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: p.category === "Veg" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: p.category === "Veg" ? "#10b981" : "#ef4444", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button onClick={() => setPizzas(prev => prev.map(x => x.id === p.id ? { ...x, available: !x.available } : x))}
                            style={{ background: p.available ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: p.available ? "#10b981" : "#ef4444", border: "none", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600, fontFamily: "var(--font)" }}>
                            {p.available ? "✅ Available" : "❌ Unavailable"}
                          </button>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button className="btn-danger" style={{ padding: "6px 14px", fontSize: "12px" }}
                            onClick={() => { setPizzas(prev => prev.filter(x => x.id !== p.id)); showToast("🗑️ Pizza removed!"); }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "Orders" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "var(--text-white)", fontWeight: 600 }}>All Orders ({orders.length})</h3>
                <button className="btn-outline" style={{ fontSize: "13px", padding: "7px 14px" }} onClick={fetchOrders}>🔄 Refresh</button>
              </div>

              {ordersLoading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--orange)", fontSize: "1.1rem" }}>📦 Loading orders...</div>
              ) : (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#0d0d0d" }}>
                        {["Order ID","User","Items","Total","Date","Status","Update"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id} style={{ borderTop: "1px solid var(--border)" }}>
                          <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", color: "var(--orange)" }}>#{o._id?.slice(-6).toUpperCase()}</td>
                          <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-white)" }}>{o.user?.username || "—"}</td>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-muted)", maxWidth: "160px" }}>
                            {o.cartItems?.map(i => `${i.name} x${i.quantity}`).join(", ")}
                          </td>
                          <td style={{ padding: "12px 16px", color: "#10b981", fontWeight: 600 }}>₹{o.totalAmount}</td>
                          <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-muted)" }}>
                            {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: (STATUS_COLORS[o.status] || "#888") + "22", color: STATUS_COLORS[o.status] || "#888", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <select className="input-field" style={{ padding: "6px 10px", fontSize: "12px", width: "auto" }}
                              value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                              {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "Users" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "var(--text-white)", fontWeight: 600 }}>Registered Users ({users.length})</h3>
                <button className="btn-outline" style={{ fontSize: "13px", padding: "7px 14px" }} onClick={fetchUsers}>🔄 Refresh</button>
              </div>

              {usersLoading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "var(--orange)", fontSize: "1.1rem" }}>👥 Loading users...</div>
              ) : (
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#0d0d0d" }}>
                        {["#","Avatar","Username","Email","Role","Joined"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u._id} style={{ borderTop: "1px solid var(--border)" }}>
                          <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{i + 1}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--orange)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                              {(u.username || "U")[0].toUpperCase()}
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-white)", fontSize: "14px" }}>{u.username}</td>
                          <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{u.email}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: u.role === "admin" ? "rgba(255,102,0,0.15)" : "rgba(100,100,100,0.15)", color: u.role === "admin" ? "var(--orange)" : "var(--text-muted)", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                              {u.role === "admin" ? "⚙️ Admin" : "👤 User"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "12px" }}>
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}