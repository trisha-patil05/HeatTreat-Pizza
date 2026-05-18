import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const TABS = ["Overview", "Analytics", "Pizzas", "Orders", "Users"];

const initialPizzas = [
  { id: 1, name: "Margherita",   price: 200, category: "Veg",     available: true },
  { id: 2, name: "Pepperoni",    price: 250, category: "Non-Veg", available: true },
  { id: 3, name: "Paneer Tikka", price: 260, category: "Veg",     available: true },
  { id: 4, name: "BBQ Chicken",  price: 270, category: "Non-Veg", available: false },
  { id: 5, name: "Four Cheese",  price: 280, category: "Veg",     available: true },
];

const statusColors = {
  "Delivered":          "#66cc66",
  "Preparing":          "#ffaa00",
  "Out for Delivery":   "#00aaff",
  "Pending":            "#ff4444",
  "Placed":             "#aa66ff",
  "Cancelled":          "#ff4444",
};

// ── Bar Chart ──
function BarChart({ data, valueKey, labelKey, color = "#ff6600", title }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="chart-wrapper">
      <p className="chart-title">{title}</p>
      <div className="bar-chart">
        {data.map((item, i) => (
          <div key={i} className="bar-col">
            <div className="bar-value">{item[valueKey]}</div>
            <div className="bar" style={{ height: `${Math.max((item[valueKey] / max) * 140, 4)}px`, background: color }} />
            <div className="bar-label">{item[labelKey]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Donut Chart ──
function DonutChart({ data, title }) {
  const total  = data.reduce((s, d) => s + d.value, 0) || 1;
  const colors = ["#ff6600", "#66cc66", "#00aaff", "#ffaa00", "#cc44cc"];
  let cum = 0;
  const segments = data.map((item, i) => {
    const pct = (item.value / total) * 100;
    const start = cum; cum += pct;
    return { ...item, pct, start, color: colors[i % colors.length] };
  });
  const grad = segments.map(s => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(", ");

  return (
    <div className="donut-wrapper">
      <p className="chart-title">{title}</p>
      <div className="donut-chart-row">
        <div className="donut" style={{ background: `conic-gradient(${grad})` }}>
          <div className="donut-hole"><span>{total}</span><small>total</small></div>
        </div>
        <div className="donut-legend">
          {segments.map((s, i) => (
            <div key={i} className="legend-item">
              <span className="legend-dot" style={{ background: s.color }} />
              <span className="legend-label">{s.label}</span>
              <span className="legend-val">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]       = useState("Overview");
  const [pizzas, setPizzas]             = useState(initialPizzas);
  const [newPizza, setNewPizza]         = useState({ name: "", price: "", category: "Veg" });
  const [showAddForm, setShowAddForm]   = useState(false);
  const [toast, setToast]               = useState("");

  // ✅ Real orders from MongoDB
  const [realOrders, setRealOrders]     = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // ✅ Real users from MongoDB
  const [realUsers, setRealUsers]       = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Analytics
  const [analytics, setAnalytics]       = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // ── Fetch Analytics ──
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const { data } = await api.get("/orders/analytics");
      setAnalytics(data);
    } catch (err) {
      console.error("Analytics error:", err);
      setAnalytics({
        totalRevenue: 0, totalOrders: 0, totalUsers: 0, pendingOrders: 0,
        statusBreakdown: { Placed: 0, Preparing: 0, "Out for Delivery": 0, Delivered: 0, Cancelled: 0 },
        paymentBreakdown: { cash: 0, card: 0, upi: 0 },
        last7Days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => ({ date: d, orders: 0, revenue: 0 })),
        topPizzas: [], recentOrders: [],
      });
    } finally { setAnalyticsLoading(false); }
  }, []);

  // ✅ Fetch Real Orders from MongoDB
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get("/orders/all");
      setRealOrders(data.orders || []);
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally { setOrdersLoading(false); }
  }, []);

  // ✅ Fetch Real Users from MongoDB
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const { data } = await api.get("/auth/users");
      setRealUsers(data.users || []);
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally { setUsersLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "Overview" || activeTab === "Analytics") fetchAnalytics();
    if (activeTab === "Orders")  fetchOrders();
    if (activeTab === "Users")   fetchUsers();
  }, [activeTab, fetchAnalytics, fetchOrders, fetchUsers]);

  // ✅ Update order status in MongoDB
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setRealOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      showToast(`✅ Order status updated!`);
    } catch (err) {
      showToast("❌ Update failed");
    }
  };

  const handleDeletePizza    = (id) => { setPizzas(prev => prev.filter(p => p.id !== id)); showToast("🗑️ Pizza removed!"); };
  const handleToggleAvailable = (id) => setPizzas(prev => prev.map(p => p.id === id ? { ...p, available: !p.available } : p));

  const handleAddPizza = () => {
    if (!newPizza.name || !newPizza.price) { showToast("⚠️ Please fill all fields"); return; }
    setPizzas(prev => [...prev, { id: Date.now(), name: newPizza.name, price: parseInt(newPizza.price), category: newPizza.category, available: true }]);
    setNewPizza({ name: "", price: "", category: "Veg" });
    setShowAddForm(false);
    showToast("✅ Pizza added!");
  };

  const totalRevenue  = analytics?.totalRevenue  ?? 0;
  const totalOrders   = analytics?.totalOrders   ?? 0;
  const pendingOrders = analytics?.pendingOrders  ?? 0;
  const totalUsers    = analytics?.totalUsers     ?? 0;

  return (
    <div className="admin-page">
      {toast && <div className="toast">{toast}</div>}

      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">🍕 HeatTreat</div>
        <p className="admin-welcome">Welcome, {user?.name || "Admin"}</p>
        <nav className="admin-nav">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`admin-nav-item ${activeTab === tab ? "active-nav" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Overview" ? "📊" : tab === "Analytics" ? "📈" : tab === "Pizzas" ? "🍕" : tab === "Orders" ? "📦" : "👥"} {tab}
            </button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={() => { logout(); navigate("/"); }}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h2 className="admin-title">{activeTab}</h2>
          <span className="admin-date">{new Date().toDateString()}</span>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          <div>
            <div className="stats-grid">
              {[
                { icon: "💰", label: "Total Revenue",  value: `₹${totalRevenue}` },
                { icon: "📦", label: "Total Orders",   value: totalOrders },
                { icon: "⏳", label: "Pending Orders", value: pendingOrders },
                { icon: "👥", label: "Total Users",    value: totalUsers },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div><p className="stat-label">{s.label}</p><h3 className="stat-value">{s.value}</h3></div>
                </div>
              ))}
            </div>

            {analytics?.last7Days && (
              <div className="admin-section">
                <BarChart data={analytics.last7Days} valueKey="orders" labelKey="date" title="📦 Orders — Last 7 Days" />
              </div>
            )}

            <div className="admin-section">
              <h3 className="section-heading">Recent Orders</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Time</th></tr></thead>
                  <tbody>
                    {(analytics?.recentOrders || []).map((order, i) => (
                      <tr key={i}>
                        <td style={{ color: "var(--orange)" }}>#{order.id}</td>
                        <td>{order.user}</td>
                        <td>₹{order.total}</td>
                        <td>
                          <span className="status-badge" style={{ background: (statusColors[order.status] || "#888") + "22", color: statusColors[order.status] || "#888", border: `1px solid ${statusColors[order.status] || "#888"}` }}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeTab === "Analytics" && (
          <div>
            {analyticsLoading ? (
              <div style={{ textAlign: "center", padding: "60px", color: "var(--orange)", fontSize: "1.2rem" }}>📊 Loading analytics...</div>
            ) : analytics ? (
              <>
                <div className="stats-grid" style={{ marginBottom: "24px" }}>
                  {[
                    { icon: "💰", label: "Total Revenue", value: `₹${analytics.totalRevenue}` },
                    { icon: "📦", label: "Total Orders",  value: analytics.totalOrders },
                    { icon: "👥", label: "Total Users",   value: analytics.totalUsers },
                    { icon: "⏳", label: "Pending",       value: analytics.pendingOrders },
                  ].map((s, i) => (
                    <div key={i} className="stat-card">
                      <div className="stat-icon">{s.icon}</div>
                      <div><p className="stat-label">{s.label}</p><h3 className="stat-value">{s.value}</h3></div>
                    </div>
                  ))}
                </div>

                <div className="charts-row">
                  <div className="admin-section chart-section">
                    <BarChart data={analytics.last7Days} valueKey="orders" labelKey="date" color="#ff6600" title="📦 Orders — Last 7 Days" />
                  </div>
                  <div className="admin-section chart-section">
                    <BarChart data={analytics.last7Days} valueKey="revenue" labelKey="date" color="#66cc66" title="💰 Revenue — Last 7 Days (₹)" />
                  </div>
                </div>

                <div className="charts-row">
                  <div className="admin-section chart-section">
                    <DonutChart title="📊 Order Status" data={Object.entries(analytics.statusBreakdown).map(([label, value]) => ({ label, value }))} />
                  </div>
                  <div className="admin-section chart-section">
                    <DonutChart title="💳 Payment Methods" data={[
                      { label: "Cash", value: analytics.paymentBreakdown.cash },
                      { label: "Card", value: analytics.paymentBreakdown.card },
                      { label: "UPI",  value: analytics.paymentBreakdown.upi },
                    ]} />
                  </div>
                </div>

                {analytics.topPizzas?.length > 0 && (
                  <div className="admin-section">
                    <BarChart data={analytics.topPizzas} valueKey="count" labelKey="name" color="#aa66ff" title="🍕 Top Selling Pizzas" />
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No analytics data.</p>
            )}
          </div>
        )}

        {/* ── PIZZAS ── */}
        {activeTab === "Pizzas" && (
          <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="section-heading" style={{ margin: 0 }}>Pizza Menu</h3>
              <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "✕ Cancel" : "+ Add Pizza"}
              </button>
            </div>

            {showAddForm && (
              <div className="add-pizza-form">
                <h4 style={{ color: "var(--orange)", marginBottom: "16px" }}>Add New Pizza</h4>
                <div className="admin-form-row">
                  <div className="input-group">
                    <label className="input-label">Pizza Name</label>
                    <input className="input-field" type="text" placeholder="e.g. Spicy Veggie" value={newPizza.name} onChange={(e) => setNewPizza({ ...newPizza, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Price (₹)</label>
                    <input className="input-field" type="number" placeholder="e.g. 299" value={newPizza.price} onChange={(e) => setNewPizza({ ...newPizza, price: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select className="input-field" value={newPizza.category} onChange={(e) => setNewPizza({ ...newPizza, category: e.target.value })}>
                      <option>Veg</option><option>Non-Veg</option><option>Spicy</option>
                    </select>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleAddPizza}>Add Pizza</button>
              </div>
            )}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Name</th><th>Price</th><th>Category</th><th>Available</th><th>Actions</th></tr></thead>
                <tbody>
                  {pizzas.map((pizza, i) => (
                    <tr key={pizza.id}>
                      <td>{i + 1}</td>
                      <td>{pizza.name}</td>
                      <td>₹{pizza.price}</td>
                      <td><span className="category-tag">{pizza.category}</span></td>
                      <td>
                        <button className={`toggle-btn ${pizza.available ? "toggle-on" : "toggle-off"}`} onClick={() => handleToggleAvailable(pizza.id)}>
                          {pizza.available ? "✅ Available" : "❌ Unavailable"}
                        </button>
                      </td>
                      <td>
                        <button className="btn-danger" style={{ padding: "6px 14px", fontSize: "13px" }} onClick={() => handleDeletePizza(pizza.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORDERS — Real MongoDB Data ── */}
        {activeTab === "Orders" && (
          <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="section-heading" style={{ margin: 0 }}>All Orders</h3>
              <button className="btn-outline" onClick={fetchOrders} style={{ fontSize: "13px", padding: "7px 14px" }}>
                🔄 Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--orange)" }}>📦 Loading orders...</div>
            ) : realOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Koi order nahi mila.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>Order ID</th><th>User</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Update</th></tr>
                  </thead>
                  <tbody>
                    {realOrders.map(order => (
                      <tr key={order._id}>
                        <td style={{ color: "var(--orange)", fontFamily: "monospace" }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td>{order.user?.username || "Unknown"}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                          {order.cartItems?.map(i => `${i.name} x${i.quantity}`).join(", ") || "—"}
                        </td>
                        <td style={{ color: "#66cc66", fontWeight: 600 }}>₹{order.totalAmount}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td>
                          <span className="status-badge" style={{ background: (statusColors[order.status] || "#888") + "22", color: statusColors[order.status] || "#888", border: `1px solid ${statusColors[order.status] || "#888"}` }}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="input-field"
                            style={{ padding: "6px 10px", fontSize: "13px" }}
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option>Placed</option>
                            <option>Preparing</option>
                            <option>Out for Delivery</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
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

        {/* ── USERS — Real MongoDB Data ── */}
        {activeTab === "Users" && (
          <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="section-heading" style={{ margin: 0 }}>
                Registered Users {!usersLoading && `(${realUsers.length})`}
              </h3>
              <button className="btn-outline" onClick={fetchUsers} style={{ fontSize: "13px", padding: "7px 14px" }}>
                🔄 Refresh
              </button>
            </div>

            {usersLoading ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--orange)" }}>👥 Loading users...</div>
            ) : realUsers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Koi user nahi mila.</div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>#</th><th>Avatar</th><th>Username</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {realUsers.map((u, i) => (
                      <tr key={u._id}>
                        <td>{i + 1}</td>
                        <td>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            background: "var(--orange)", color: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "13px"
                          }}>
                            {(u.username || "U")[0].toUpperCase()}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{u.username}</td>
                        <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{u.email}</td>
                        <td>
                          <span className="category-tag" style={{
                            background: u.role === "admin" ? "rgba(255,102,0,0.15)" : "rgba(100,100,100,0.15)",
                            color: u.role === "admin" ? "var(--orange)" : "var(--text-muted)"
                          }}>
                            {u.role === "admin" ? "⚙️ Admin" : "👤 User"}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>
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
    </div>
  );
}

export default AdminDashboard;