import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const statusColors = {
    "Placed": "#ffaa00",
    "Preparing": "#00aaff",
    "Out for Delivery": "#aa66ff",
    "Delivered": "#66cc66",
    "Cancelled": "#ff4444",
};

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(res.data.orders);
            } catch (err) {
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return (
        <div className="order-page">
            <div className="order-container" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--orange)', fontSize: '1.2rem' }}>🍕 Loading your orders...</p>
            </div>
        </div>
    );

    return (
        <div className="order-page">
            <div className="order-container" style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="page-title" style={{ margin: 0 }}>📦 My Orders</h2>
                    <button className="btn-outline" onClick={() => navigate('/home')}>+ Order More</button>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center' }}>{error}</p>}

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>😕 No orders yet!</p>
                        <button className="btn-primary" onClick={() => navigate('/home')}>Order Now</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order) => (
                            <div key={order._id} className="order-history-card">

                                {/* Header */}
                                <div className="order-history-header">
                                    <div>
                                        <p className="order-history-id">Order #{order._id.slice(-6).toUpperCase()}</p>
                                        <p className="order-history-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{
                                            background: (statusColors[order.status] || '#888') + '22',
                                            color: statusColors[order.status] || '#888',
                                            border: `1px solid ${statusColors[order.status] || '#888'}`
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                {/* Items */}
                                <div className="order-history-items">
                                    {order.cartItems.map((item, i) => (
                                        <div key={i} className="order-history-item">
                                            <span>🍕 {item.name} {item.size ? `(${item.size})` : ''}</span>
                                            <span>x{item.quantity} — ₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="order-history-footer">
                                    <div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                            📍 {order.address}
                                        </p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                            💳 {order.payment === 'cash' ? 'Cash on Delivery' : order.payment === 'card' ? 'Card' : 'UPI'}
                                        </p>
                                    </div>
                                    <p className="order-history-total">₹{order.totalAmount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;