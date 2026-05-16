import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Summary() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('orderData'));
    setOrder(data);
  }, []);

  if (!order) return (
    <div className="summary-page">
      <div className="summary-box" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No order found.</p>
        <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/home')}>Go to Menu</button>
      </div>
    </div>
  );

  const subtotal = order.subtotal || order.totalPrice || 0;
  const gst = order.gst || Math.round(subtotal * 0.18);
  const grandTotal = order.grandTotal || subtotal + gst;
  const orderId = order.orderId || 'HT000000';

  const handleDownload = () => {
    const text = `
╔══════════════════════════════════╗
       🍕 HeatTreat Pizza Receipt
╚══════════════════════════════════╝

Order ID   : ${orderId}
Address    : ${order.address || 'N/A'}
Payment    : ${order.payment || 'Cash on Delivery'}

─────────────────────────────────
Items:
${order.cartItems ? order.cartItems.map(i => `  • ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('\n') : `  • Pizza (${order.size})`}

─────────────────────────────────
Pizza Size : ${order.size || 'N/A'}
Toppings   : ${order.toppings?.join(', ') || 'None'}
Drink      : ${order.drink || 'N/A'}

─────────────────────────────────
Subtotal   : ₹${subtotal}
GST (18%)  : ₹${gst}
TOTAL      : ₹${grandTotal}
─────────────────────────────────

Thank you for ordering with HeatTreat Pizza! 🍕
    `.trim();

    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    el.download = `HeatTreat_Receipt_${orderId}.txt`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const handleWhatsApp = () => {
    const msg = `🍕 *HeatTreat Pizza Order*\n\nOrder ID: ${orderId}\nTotal: ₹${grandTotal}\nDelivery: ${order.address || 'N/A'}\n\nThank you for ordering! 🔥`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="summary-page" style={{ alignItems: 'flex-start', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="summary-success-icon">🎉</div>
          <h2 className="page-title" style={{ marginTop: '12px' }}>Order Receipt</h2>
          <p style={{ color: 'var(--text-muted)' }}>Thank you for ordering with HeatTreat Pizza!</p>
        </div>

        {/* 2 Column Layout */}
        <div className="summary-two-col">

          {/* LEFT — Order Details */}
          <div className="summary-left">
            <div className="summary-box" style={{ margin: 0 }}>
              <p className="input-label" style={{ marginBottom: '14px' }}>📋 Order Details</p>
              <div className="summary-detail">
                <div className="summary-row"><span>Order ID</span><strong style={{ color: 'var(--orange)' }}>{orderId}</strong></div>
                {order.address && <div className="summary-row"><span>Delivery Address</span><strong>{order.address}</strong></div>}
                {order.payment && (
                  <div className="summary-row">
                    <span>Payment</span>
                    <strong>{order.payment === 'cash' ? '💵 Cash on Delivery' : order.payment === 'card' ? '💳 Card' : '📱 UPI'}</strong>
                  </div>
                )}
                <div className="summary-row"><span>Pizza Size</span><strong>{order.size}</strong></div>
                <div className="summary-row"><span>Toppings</span><strong>{order.toppings?.join(', ') || 'None'}</strong></div>
                <div className="summary-row"><span>Drink</span><strong>{order.drink}</strong></div>
              </div>

              {/* Cart items */}
              {order.cartItems && order.cartItems.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <p className="input-label" style={{ marginBottom: '10px' }}>🛒 Items Ordered</p>
                  {order.cartItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '14px' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Bill + Actions */}
          <div className="summary-right">
            <div className="summary-box" style={{ margin: 0 }}>
              <p className="input-label" style={{ marginBottom: '14px' }}>💰 Bill Summary</p>

              <div className="bill-breakdown">
                <div className="bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="bill-row"><span>GST (18%)</span><span>₹{gst}</span></div>
                <div className="bill-row total-row"><span>Grand Total</span><span>₹{grandTotal}</span></div>
              </div>

              <div className="delivery-time-box" style={{ marginTop: '16px' }}>
                🕐 Estimated Delivery: <strong>30–45 minutes</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleDownload}>📄 Download Receipt</button>
                <button className="btn-whatsapp" style={{ flex: 1 }} onClick={handleWhatsApp}>💬 WhatsApp</button>
              </div>

              <button className="btn-outline" style={{ width: '100%', marginTop: '12px' }} onClick={() => navigate('/home')}>
                🍕 Order More Pizza
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;