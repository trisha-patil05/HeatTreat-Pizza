import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const paymentMethods = [
  { id: 'cash', label: '💵 Cash on Delivery' },
  { id: 'card', label: '💳 Credit / Debit Card' },
  { id: 'upi',  label: '📱 UPI (GPay, PhonePe, Paytm)' },
];

function generateOrderId() {
  return 'HT' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function OrderSummary() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();

  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [addressError, setAddressError] = useState('');

  const subtotal = getCartTotal();
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  const handleSubmit = () => {
    if (!address.trim()) {
      setAddressError('⚠️ Please enter your delivery address.');
      return;
    }
    setAddressError('');
    const id = generateOrderId();
    setOrderId(id);
    localStorage.setItem('orderData', JSON.stringify({
      orderId: id, cartItems, subtotal, gst, grandTotal,
      address, payment,
      size: cartItems[0]?.size || 'Medium',
      toppings: cartItems[0]?.toppings || [],
      drink: cartItems[0]?.drink || 'Coke',
      totalPrice: grandTotal,
    }));
    setConfirmed(true);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="order-page">
        <div className="order-container">
          <div className="empty-state">
            <p>🛒 No items in cart</p>
            <button className="btn-primary" onClick={() => navigate("/cart")}>Go to Cart</button>
          </div>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="order-page">
        <div className="order-container" style={{ textAlign: 'center' }}>
          <div className="order-success-icon">✅</div>
          <h2 className="page-title" style={{ marginTop: '16px' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>Your delicious pizza is on its way 🍕</p>

          <div className="order-confirm-box">
            <p><span>Order ID</span><strong>{orderId}</strong></p>
            <p><span>Delivery To</span><strong>{address}</strong></p>
            <p><span>Payment</span><strong>{paymentMethods.find(p => p.id === payment)?.label}</strong></p>
            <p><span>Estimated Time</span><strong>🕐 30–45 minutes</strong></p>
            <p><span>Grand Total</span><strong style={{ color: 'var(--orange)' }}>₹{grandTotal}</strong></p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate('/summary')}>View Receipt</button>
            <button className="btn-outline" style={{ flex: 1 }} onClick={() => navigate('/home')}>Order More</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-container" style={{ maxWidth: '1000px' }}>
        <h2 className="page-title">Order Summary</h2>

        {/* 2 Column Layout */}
        <div className="order-two-col">

          {/* LEFT — Cart Items */}
          <div className="order-left">
            <p className="input-label" style={{ marginBottom: '12px' }}>🛒 Your Items</p>
            {cartItems.map((item) => (
              <div className="order-item-card" key={item.id}>
                <p className="order-item-name">{item.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  Qty: {item.quantity} × ₹{item.price} = ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            {/* Bill */}
            <div className="bill-breakdown" style={{ marginTop: '16px' }}>
              <div className="bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="bill-row"><span>GST (18%)</span><span>₹{gst}</span></div>
              <div className="bill-row total-row"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            </div>
          </div>

          {/* RIGHT — Address + Payment */}
          <div className="order-right">
            <div className="input-group">
              <label className="input-label">📍 Delivery Address</label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter your full delivery address"
                value={address}
                onChange={(e) => { setAddress(e.target.value); setAddressError(''); }}
              />
              {addressError && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '6px' }}>{addressError}</p>}
            </div>

            <div className="input-group">
              <label className="input-label">💳 Payment Method</label>
              <div className="payment-options">
                {paymentMethods.map((method) => (
                  <label key={method.id} className={`payment-option ${payment === method.id ? 'selected-payment' : ''}`}>
                    <input type="radio" name="payment" value={method.id} checked={payment === method.id} onChange={() => setPayment(method.id)} />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="delivery-time-box">
              🕐 Estimated Delivery: <strong>30–45 minutes</strong>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '14px' }} onClick={handleSubmit}>
              Confirm Order ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;