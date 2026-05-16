import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const RAZORPAY_KEY = 'YOUR_RAZORPAY_KEY_ID'; // 🔑 Replace with your real key

const CartPage = () => {
  const { cart, adjustQuantity, removePizza, calculateTotal } = useCart();
  const navigate = useNavigate();

  const total = calculateTotal ? calculateTotal() : 0;
  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;

  const handlePayment = async () => {
    if (RAZORPAY_KEY === 'YOUR_RAZORPAY_KEY_ID') {
      alert('⚠️ Razorpay key not configured. Please add your key.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: grandTotal * 100,
      });

      const options = {
        key: RAZORPAY_KEY,
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'HeatTreat Pizza',
        description: 'Pizza Order Checkout',
        order_id: res.data.id,
        handler: function (response) {
          alert('✅ Payment Successful! Your pizza is on the way 🍕');
          navigate('/summary');
        },
        prefill: {
          name: 'HeatTreat Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: { color: '#ff6600' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert('❌ Payment failed. Please try again.');
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-state">
            <p>🛒 Your cart is empty!</p>
            <button className="btn-primary" onClick={() => navigate('/home')}>
              Go to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="page-title">Your Cart</h2>

        {/* Cart Items */}
        {cart.map((pizza) => (
          <div className="cart-item-card" key={pizza.id}>
            {pizza.image && (
              <img src={pizza.image} alt={pizza.name} className="cart-item-image" />
            )}

            <div style={{ flex: 1 }}>
              <p className="cart-item-name">{pizza.name}</p>
              <p className="cart-item-detail">₹{pizza.price} per item</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div className="quantity-box">
                <button
                  className="qty-btn"
                  onClick={() => adjustQuantity(pizza.id, -1)}
                  disabled={pizza.quantity <= 1}
                >
                  -
                </button>
                <span className="qty-count">{pizza.quantity}</span>
                <button className="qty-btn" onClick={() => adjustQuantity(pizza.id, 1)}>+</button>
              </div>

              <p className="item-total-price">₹{pizza.price * pizza.quantity}</p>

              <button className="btn-danger" onClick={() => removePizza(pizza.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {/* Bill Breakdown */}
        <div className="bill-breakdown">
          <div className="bill-row">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="bill-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="bill-row total-row">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="cart-action-row">
          <button className="btn-outline" onClick={() => navigate('/home')}>
            ← Continue Shopping
          </button>
          <button className="btn-razorpay" onClick={handlePayment}>
            💳 Pay ₹{grandTotal}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;