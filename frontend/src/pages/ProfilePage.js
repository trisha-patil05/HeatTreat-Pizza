import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const TABS = [
    { id: 'profile', label: '👤 Profile', },
    { id: 'password', label: '🔒 Change Password', },
    { id: 'orders', label: '📦 Order Stats', },
];

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Profile form
    const [form, setForm] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
    });

    // Password form
    const [pwForm, setPwForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [orderStats, setOrderStats] = useState(null);

    // Fetch profile from backend on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setFetchLoading(true);
            const { data } = await api.get("/profile");
            const u = data.user;
            setForm({
                username: u.username || '',
                email: u.email || '',
                phone: u.phone || '',
                address: u.address || '',
            });
        } catch (err) {
            // Fallback to localStorage user
            if (user) {
                setForm({
                    username: user.name || user.username || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || '',
                });
            }
        } finally {
            setFetchLoading(false);
        }
    };

    // Fetch order stats
    useEffect(() => {
        if (activeTab === 'orders') fetchOrderStats();
    }, [activeTab]);

    const fetchOrderStats = async () => {
        try {
            const { data } = await api.get("/orders/my");
            const orders = data.orders || [];
            const delivered = orders.filter(o => o.status === 'Delivered').length;
            const totalSpent = orders
                .filter(o => o.status === 'Delivered')
                .reduce((sum, o) => sum + o.totalAmount, 0);
            setOrderStats({
                total: orders.length,
                delivered,
                active: orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length,
                cancelled: orders.filter(o => o.status === 'Cancelled').length,
                totalSpent,
            });
        } catch {
            setOrderStats({ total: 0, delivered: 0, active: 0, cancelled: 0, totalSpent: 0 });
        }
    };

    const showMessage = (type, msg) => {
        if (type === 'success') { setSuccessMsg(msg); setErrorMsg(''); }
        else { setErrorMsg(msg); setSuccessMsg(''); }
        setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 3500);
    };

    // ── Save Profile ──
    const handleSaveProfile = async () => {
        if (!form.username.trim() || !form.email.trim()) {
            return showMessage('error', 'Username aur Email required hai!');
        }
        setLoading(true);
        try {
            const { data } = await api.put("/profile", form);
            updateUser({
                name: data.user.username,
                username: data.user.username,
                email: data.user.email,
                phone: data.user.phone,
                address: data.user.address,
            });
            showMessage('success', '✅ Profile successfully update ho gaya!');
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Profile update nahi hua.');
        } finally {
            setLoading(false);
        }
    };

    // ── Change Password ──
    const handleChangePassword = async () => {
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            return showMessage('error', 'Sab fields fill karo!');
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return showMessage('error', 'New passwords match nahi kar rahe!');
        }
        if (pwForm.newPassword.length < 6) {
            return showMessage('error', 'Password kam se kam 6 characters ka hona chahiye!');
        }
        setLoading(true);
        try {
            await api.put("/profile/password", {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            showMessage('success', '✅ Password successfully change ho gaya!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            showMessage('error', err.response?.data?.message || 'Password change nahi hua.');
        } finally {
            setLoading(false);
        }
    };

    // Avatar initials
    const getInitials = () => {
        const name = form.username || user?.name || 'U';
        return name.slice(0, 2).toUpperCase();
    };

    if (fetchLoading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">
                    <div className="profile-spinner">🍕</div>
                    <p>Profile load ho raha hai...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">

                {/* ── Left Panel ── */}
                <aside className="profile-sidebar">
                    <div className="profile-avatar-box">
                        <div className="profile-avatar">{getInitials()}</div>
                        <div className="profile-name">{form.username || 'User'}</div>
                        <div className="profile-email">{form.email}</div>
                        {user?.role === 'admin' && (
                            <span className="profile-role-badge">⚙️ Admin</span>
                        )}
                    </div>

                    <nav className="profile-nav">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`profile-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => { setActiveTab(tab.id); setSuccessMsg(''); setErrorMsg(''); }}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <hr className="profile-divider" />
                        <button
                            className="profile-nav-item"
                            onClick={() => navigate('/my-orders')}
                        >
                            🧾 My Orders
                        </button>
                        <button
                            className="profile-nav-item logout"
                            onClick={() => { logout(); navigate('/'); }}
                        >
                            🚪 Logout
                        </button>
                    </nav>
                </aside>

                {/* ── Right Panel ── */}
                <main className="profile-main">

                    {/* Toast Messages */}
                    {successMsg && <div className="profile-toast success">{successMsg}</div>}
                    {errorMsg && <div className="profile-toast error">{errorMsg}</div>}

                    {/* ── PROFILE TAB ── */}
                    {activeTab === 'profile' && (
                        <div className="profile-section">
                            <h2 className="profile-section-title">👤 Personal Information</h2>
                            <p className="profile-section-sub">Apni details update karo — order pe auto-fill ho jaayegi</p>

                            <div className="profile-form-grid">
                                <div className="profile-field">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={e => setForm({ ...form, username: e.target.value })}
                                        placeholder="Your username"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div className="profile-field full-width">
                                    <label>Default Delivery Address</label>
                                    <textarea
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        placeholder="Flat No, Street, City, Pincode"
                                        rows={3}
                                    />
                                    <span className="profile-field-hint">
                                        💡 Yeh address order page pe auto-fill hoga
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn-primary profile-save-btn"
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? '⏳ Saving...' : '💾 Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* ── PASSWORD TAB ── */}
                    {activeTab === 'password' && (
                        <div className="profile-section">
                            <h2 className="profile-section-title">🔒 Change Password</h2>
                            <p className="profile-section-sub">Strong password rakho — kam se kam 6 characters</p>

                            <div className="profile-form-grid single">
                                <div className="profile-field full-width">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={pwForm.currentPassword}
                                        onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                        placeholder="Purana password"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={pwForm.newPassword}
                                        onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                        placeholder="Naya password"
                                    />
                                </div>

                                <div className="profile-field">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={pwForm.confirmPassword}
                                        onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                        placeholder="Dobara naya password"
                                    />
                                </div>

                                {/* Password strength hint */}
                                {pwForm.newPassword && (
                                    <div className="profile-field full-width">
                                        <div className={`pw-strength ${pwForm.newPassword.length >= 8 ? 'strong' : pwForm.newPassword.length >= 6 ? 'medium' : 'weak'}`}>
                                            Password strength:{' '}
                                            <strong>
                                                {pwForm.newPassword.length >= 8 ? 'Strong 💪' : pwForm.newPassword.length >= 6 ? 'Medium 👍' : 'Weak ⚠️'}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn-primary profile-save-btn"
                                onClick={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? '⏳ Updating...' : '🔒 Update Password'}
                            </button>
                        </div>
                    )}

                    {/* ── ORDER STATS TAB ── */}
                    {activeTab === 'orders' && (
                        <div className="profile-section">
                            <h2 className="profile-section-title">📦 Order Statistics</h2>
                            <p className="profile-section-sub">Tumhare saare orders ka overview</p>

                            {orderStats ? (
                                <>
                                    <div className="profile-stats-grid">
                                        <div className="profile-stat-card">
                                            <div className="psc-icon">📦</div>
                                            <div className="psc-value">{orderStats.total}</div>
                                            <div className="psc-label">Total Orders</div>
                                        </div>
                                        <div className="profile-stat-card">
                                            <div className="psc-icon">✅</div>
                                            <div className="psc-value">{orderStats.delivered}</div>
                                            <div className="psc-label">Delivered</div>
                                        </div>
                                        <div className="profile-stat-card">
                                            <div className="psc-icon">🔥</div>
                                            <div className="psc-value">{orderStats.active}</div>
                                            <div className="psc-label">Active</div>
                                        </div>
                                        <div className="profile-stat-card highlight">
                                            <div className="psc-icon">💰</div>
                                            <div className="psc-value">₹{orderStats.totalSpent}</div>
                                            <div className="psc-label">Total Spent</div>
                                        </div>
                                    </div>

                                    <button
                                        className="btn-outline"
                                        style={{ marginTop: '20px' }}
                                        onClick={() => navigate('/my-orders')}
                                    >
                                        🧾 View All Orders
                                    </button>
                                </>
                            ) : (
                                <div className="profile-loading">
                                    <div className="profile-spinner">📦</div>
                                    <p>Stats load ho rahi hain...</p>
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}