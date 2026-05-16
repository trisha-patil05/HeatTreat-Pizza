import { useState } from "react";
// CSS is in global.css — no separate import needed

// ─── Mock Data (Replace with real API calls) ───────────────────────────────
const MOCK_PIZZAS = [
  { _id: "1", name: "Margherita", price: 199, category: "Veg", available: true, image: "🍕" },
  { _id: "2", name: "Pepperoni", price: 299, category: "Non-Veg", available: true, image: "🍕" },
  { _id: "3", name: "BBQ Chicken", price: 349, category: "Non-Veg", available: false, image: "🍕" },
  { _id: "4", name: "Paneer Tikka", price: 249, category: "Veg", available: true, image: "🍕" },
];

const MOCK_ORDERS = [
  { _id: "ORD001", user: "Rahul Sharma", items: ["Margherita x2"], total: 398, status: "Delivered", date: "2025-05-14" },
  { _id: "ORD002", user: "Priya Patel", items: ["Pepperoni x1", "BBQ Chicken x1"], total: 648, status: "Preparing", date: "2025-05-15" },
  { _id: "ORD003", user: "Aman Verma", items: ["Paneer Tikka x3"], total: 747, status: "Out for Delivery", date: "2025-05-15" },
  { _id: "ORD004", user: "Sneha Joshi", items: ["Margherita x1"], total: 199, status: "Pending", date: "2025-05-16" },
];

const MOCK_USERS = [
  { _id: "U1", name: "Rahul Sharma", email: "rahul@gmail.com", orders: 5, joined: "2025-01-10" },
  { _id: "U2", name: "Priya Patel", email: "priya@gmail.com", orders: 3, joined: "2025-02-20" },
  { _id: "U3", name: "Aman Verma", email: "aman@gmail.com", orders: 8, joined: "2025-03-05" },
  { _id: "U4", name: "Sneha Joshi", email: "sneha@gmail.com", orders: 1, joined: "2025-05-01" },
];

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Preparing: "#3b82f6",
  "Out for Delivery": "#8b5cf6",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

// ─── Add Pizza Modal ────────────────────────────────────────────────────────
function AddPizzaModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", price: "", category: "Veg", available: true });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert("Name aur Price required hai!");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate API call
    onAdd({ ...form, _id: Date.now().toString(), price: Number(form.price), image: "🍕" });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🍕 Naya Pizza Add Karo</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <label>Pizza Name</label>
          <input
            type="text"
            placeholder="e.g. Farmhouse Delight"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label>Price (₹)</label>
          <input
            type="number"
            placeholder="e.g. 299"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Veg</option>
            <option>Non-Veg</option>
          </select>
          <label className="toggle-label">
            <span>Available</span>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
            />
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-add" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Pizza"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ───────────────────────────────────────────────────
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pizzas, setPizzas] = useState(MOCK_PIZZAS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [users] = useState(MOCK_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Stats
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const totalUsers = users.length;

  // Delete pizza
  const handleDeletePizza = async (id) => {
    if (!window.confirm("Pizza delete karna chahte ho?")) return;
    setDeletingId(id);
    await new Promise((r) => setTimeout(r, 600));
    setPizzas((prev) => prev.filter((p) => p._id !== id));
    setDeletingId(null);
  };

  // Toggle pizza availability
  const toggleAvailability = (id) => {
    setPizzas((prev) =>
      prev.map((p) => (p._id === id ? { ...p, available: !p.available } : p))
    );
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    await new Promise((r) => setTimeout(r, 500));
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    setUpdatingOrderId(null);
  };

  const filteredPizzas = pizzas.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "pizzas", label: "Pizzas", icon: "🍕" },
    { id: "orders", label: "Orders", icon: "📋" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🔥</span>
          <div>
            <div className="brand-name">PizzaAdmin</div>
            <div className="brand-sub">Control Panel</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "orders" && activeOrders > 0 && (
                <span className="nav-badge">{activeOrders}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-avatar">A</div>
          <div>
            <div className="admin-name">Admin</div>
            <div className="admin-role">Super Admin</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div>
            <h1 className="page-title">
              {tabs.find((t) => t.id === activeTab)?.icon}{" "}
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="page-subtitle">
              {activeTab === "overview" && "Aaj ka performance dekho"}
              {activeTab === "pizzas" && `${pizzas.length} pizzas available`}
              {activeTab === "orders" && `${activeOrders} active orders`}
              {activeTab === "users" && `${totalUsers} registered users`}
            </p>
          </div>
          <div className="header-time">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </div>
        </header>

        <div className="admin-content">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card revenue">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                  <div className="stat-trend up">↑ 12%</div>
                </div>
                <div className="stat-card orders">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <div className="stat-value">{totalOrders}</div>
                    <div className="stat-label">Total Orders</div>
                  </div>
                  <div className="stat-trend up">↑ 8%</div>
                </div>
                <div className="stat-card active">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-info">
                    <div className="stat-value">{activeOrders}</div>
                    <div className="stat-label">Active Orders</div>
                  </div>
                  <div className="stat-trend neutral">Live</div>
                </div>
                <div className="stat-card users">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">{totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                  <div className="stat-trend up">↑ 3%</div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="admin-section-card">
                <div className="admin-section-card-header">
                  <h3>Recent Orders</h3>
                  <button className="link-btn" onClick={() => setActiveTab("orders")}>
                    Sab dekho →
                  </button>
                </div>
                <div className="orders-table">
                  <div className="table-head">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>
                  {orders.slice(0, 3).map((order) => (
                    <div className="table-row" key={order._id}>
                      <span className="order-id">#{order._id}</span>
                      <span>{order.user}</span>
                      <span className="amount">₹{order.total}</span>
                      <span
                        className="status-badge"
                        style={{ background: STATUS_COLORS[order.status] + "22", color: STATUS_COLORS[order.status] }}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pizza Summary */}
              <div className="admin-section-card">
                <div className="admin-section-card-header">
                  <h3>Pizza Inventory</h3>
                  <button className="link-btn" onClick={() => setActiveTab("pizzas")}>
                    Manage →
                  </button>
                </div>
                <div className="pizza-summary">
                  <div className="summary-item">
                    <span className="summary-dot green"></span>
                    <span>Available: {pizzas.filter((p) => p.available).length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-dot red"></span>
                    <span>Unavailable: {pizzas.filter((p) => !p.available).length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-dot blue"></span>
                    <span>Total: {pizzas.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PIZZAS TAB ── */}
          {activeTab === "pizzas" && (
            <div className="pizzas-section">
              <div className="section-toolbar">
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="🔍 Pizza dhundho..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  + Add Pizza
                </button>
              </div>

              <div className="pizza-grid">
                {filteredPizzas.map((pizza) => (
                  <div className={`pizza-card ${!pizza.available ? "unavailable" : ""}`} key={pizza._id}>
                    <div className="pizza-emoji">{pizza.image}</div>
                    <div className="pizza-info">
                      <div className="pizza-name">{pizza.name}</div>
                      <div className="pizza-meta">
                        <span className={`category-tag ${pizza.category === "Veg" ? "veg" : "nonveg"}`}>
                          {pizza.category}
                        </span>
                        <span className="pizza-price">₹{pizza.price}</span>
                      </div>
                    </div>
                    <div className="pizza-actions">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={pizza.available}
                          onChange={() => toggleAvailability(pizza._id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePizza(pizza._id)}
                        disabled={deletingId === pizza._id}
                      >
                        {deletingId === pizza._id ? "..." : "🗑️"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPizzas.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🍕</div>
                  <p>Koi pizza nahi mila</p>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <div className="orders-section">
              <div className="orders-table full">
                <div className="table-head full">
                  <span>Order ID</span>
                  <span>Customer</span>
                  <span>Items</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {orders.map((order) => (
                  <div className="table-row full" key={order._id}>
                    <span className="order-id">#{order._id}</span>
                    <span>{order.user}</span>
                    <span className="items-text">{order.items.join(", ")}</span>
                    <span className="amount">₹{order.total}</span>
                    <span className="date-text">{order.date}</span>
                    <span>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingOrderId === order._id}
                        style={{ color: STATUS_COLORS[order.status] }}
                      >
                        {Object.keys(STATUS_COLORS).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updatingOrderId === order._id && (
                        <span className="updating-text">Updating...</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div className="users-section">
              <div className="orders-table full">
                <div className="table-head full">
                  <span>Avatar</span>
                  <span>Name</span>
                  <span>Email</span>
                  <span>Total Orders</span>
                  <span>Joined</span>
                </div>
                {users.map((user) => (
                  <div className="table-row full" key={user._id}>
                    <span>
                      <div className="user-avatar">{user.name[0]}</div>
                    </span>
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                    <span>
                      <span className="order-count">{user.orders} orders</span>
                    </span>
                    <span className="date-text">{user.joined}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Pizza Modal */}
      {showAddModal && (
        <AddPizzaModal
          onClose={() => setShowAddModal(false)}
          onAdd={(pizza) => setPizzas((prev) => [...prev, pizza])}
        />
      )}
    </div>
  );
}

export default AdminDashboard;