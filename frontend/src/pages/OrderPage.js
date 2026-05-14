import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './OrderPage.css';

function OrderSummary() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal } = useCart();
  const [address, setAddress] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const total = getCartTotal();

  const handleSubmit = () => {
    if (address.trim()) {
      setConfirmed(true);
    } else {
      alert('Please enter your address before confirming.');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="order-summary-container">
        <p className="loading-text">No items in cart</p>
        <button onClick={() => navigate("/cart")}>Go to Cart</button>
      </div>
    );
  }

  return (
    <div className="order-summary-container">
      <h2>Order Summary</h2>

      <div className="order-card">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item-preview">
            <h4>{item.name}</h4>
            <p>Qty: {item.quantity} × ₹{item.price} = ₹{item.price * item.quantity}</p>
          </div>
        ))}
        <div className="total-row">
          <strong>Total: ₹{total}</strong>
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="address-input"
      />

      <button onClick={handleSubmit} className="confirm-button">
        Confirm Order
      </button>

      {confirmed && (
        <div className="confirmation-message">
          🎉 Your order is confirmed and on its way to <strong>{address}</strong>!
        </div>
      )}
    </div>
  );
}

export default OrderSummary;