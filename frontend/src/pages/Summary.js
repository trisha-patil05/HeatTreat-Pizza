import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Summary() {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('orderData');
    if (data) setOrder(JSON.parse(data));
  }, []);

  if (!order) return (
    <div className="summary-page">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧾</div>
        <p style={{ color: '#888', marginBottom: '20px' }}>Koi order nahi mila. Pehle order place karo!</p>
        <button className="btn-primary" onClick={() => navigate('/home')}>🍕 Menu Dekho</button>
      </div>
    </div>
  );

  const subtotal   = order.subtotal   || order.totalPrice || 0;
  const gst        = order.gst        || Math.round(subtotal * 0.18);
  const grandTotal = order.grandTotal || subtotal + gst;
  const orderId    = order.orderId    || 'HT000000';

  const paymentLabel =
    order.payment === 'cash' ? '💵 Cash on Delivery' :
    order.payment === 'card' ? '💳 Credit / Debit Card' :
    order.payment === 'upi'  ? '📱 UPI' : order.payment || 'Cash on Delivery';

  const handleDownload = () => {
    const itemsText = order.cartItems?.length > 0
      ? order.cartItems.map(i => `  • ${i.name} x${i.quantity}  =  ₹${i.price * i.quantity}`).join('\n')
      : `  • Pizza (${order.size || 'Medium'})`;

    const receipt = `
╔══════════════════════════════════════╗
        🍕  HeatTreat Pizza
           ORDER RECEIPT
╚══════════════════════════════════════╝

  Order ID   : ${orderId}
  Date       : ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
  Time       : ${new Date().toLocaleTimeString('en-IN')}

──────────────────────────────────────
  ITEMS ORDERED
──────────────────────────────────────
${itemsText}

──────────────────────────────────────
  DELIVERY INFO
──────────────────────────────────────
  Address    : ${order.address || 'N/A'}
  Payment    : ${paymentLabel}
  Est. Time  : 30–45 minutes

──────────────────────────────────────
  BILL SUMMARY
──────────────────────────────────────
  Subtotal   : ₹${subtotal}
  GST (18%)  : ₹${gst}
  ─────────────────────────────
  TOTAL      : ₹${grandTotal}
──────────────────────────────────────

  Thank you for ordering with
  HeatTreat Pizza! 🔥
══════════════════════════════════════
    `.trim();

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const el   = document.createElement('a');
    el.href = url; el.download = `HeatTreat_Receipt_${orderId}.txt`;
    document.body.appendChild(el); el.click();
    document.body.removeChild(el); URL.revokeObjectURL(url);
  };

  const handleWhatsApp = () => {
    const itemsList = order.cartItems?.length > 0
      ? order.cartItems.map(i => `• ${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('\n')
      : `• Pizza (${order.size || 'Medium'})`;

    const msg = `🍕 *HeatTreat Pizza — Order Confirmed!* 🔥\n\n📋 *Order ID:* ${orderId}\n📍 *Delivery:* ${order.address || 'N/A'}\n💳 *Payment:* ${paymentLabel}\n\n🛒 *Items:*\n${itemsList}\n\n✅ *Total:* ₹${grandTotal}\n\n🕐 Est. Delivery: 30–45 minutes`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="summary-page">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="summary-success-icon">🎉</span>
          <h2 className="page-title" style={{ marginTop: '12px', textAlign: 'center' }}>Order Receipt</h2>
          <p style={{ color: '#888', marginTop: '8px' }}>Thank you for ordering with HeatTreat Pizza!</p>
        </div>

        <div className="summary-two-col">

          {/* LEFT */}
          <div className="summary-box">
            <p className="input-label" style={{ marginBottom: '14px' }}>📋 Order Details</p>

            {[
              { label: 'Order ID',     value: <strong style={{ color: '#ff6600', fontFamily: 'monospace' }}>#{String(orderId).slice(-8).toUpperCase()}</strong> },
              { label: 'Date',         value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { label: 'Delivery To',  value: order.address },
              { label: 'Payment',      value: paymentLabel },
              { label: 'Status',       value: <span style={{ color: '#10b981' }}>✅ Confirmed</span> },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #222', fontSize: '14px', gap: '12px' }}>
                <span style={{ color: '#888' }}>{row.label}</span>
                <strong style={{ color: '#f0f0f0', textAlign: 'right' }}>{row.value}</strong>
              </div>
            ))}

            {order.cartItems?.length > 0 && (
              <div style={{ marginTop: '18px' }}>
                <p className="input-label" style={{ marginBottom: '10px' }}>🛒 Items Ordered</p>
                {order.cartItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e1e1e', fontSize: '14px' }}>
                    <span style={{ color: '#bbb' }}>{item.name} × {item.quantity}</span>
                    <span style={{ color: '#ff6600', fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="summary-box">
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
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleDownload}>
                📄 Download Receipt
              </button>
              <button className="btn-whatsapp" style={{ flex: 1 }} onClick={handleWhatsApp}>
                💬 WhatsApp
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => navigate('/my-orders')}>
                🧾 My Orders
              </button>
              <button className="btn-outline" style={{ flex: 1 }} onClick={() => navigate('/home')}>
                🍕 Order More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;