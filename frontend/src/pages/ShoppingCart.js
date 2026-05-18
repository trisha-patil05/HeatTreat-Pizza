import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext"; // ✅ Toast

const PROMO_CODES = { HEAT10: 10, PIZZA20: 20 };

function ShoppingCart() {
  const navigate    = useNavigate();
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getCartTotal } = useCart();
  const { showToast } = useToast(); // ✅ Toast

  const [promoCode, setPromoCode]     = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError]   = useState('');

  const subtotal        = getCartTotal();
  const discountPercent = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const discountAmount  = Math.round(subtotal * discountPercent / 100);
  const afterDiscount   = subtotal - discountAmount;
  const gst             = Math.round(afterDiscount * 0.18);
  const grandTotal      = afterDiscount + gst;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
      showToast(`🎉 Promo code ${code} apply ho gaya! ${PROMO_CODES[code]}% off`, "success");
    } else {
      setPromoError('❌ Invalid promo code');
      setAppliedPromo(null);
      showToast("Invalid promo code!", "error");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    showToast("Promo code remove ho gaya", "info");
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id);
    showToast(`${item.name} cart se remove ho gaya`, "info");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-state">
            <p>🛒 Shopping cart is empty</p>
            <button className="btn-primary" onClick={() => navigate("/home")}>Go to Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2 className="page-title">Your Shopping Cart</h2>

        <div className="cart-two-col">

          {/* LEFT — Cart Items */}
          <div className="cart-left">
            {cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-image" />

                <div style={{ flex: 1 }}>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-detail">₹{item.price} per item</p>
                  {item.size     && <p className="cart-item-detail">Size: {item.size}</p>}
                  {item.crust    && <p className="cart-item-detail">Crust: {item.crust}</p>}
                  {item.sauce    && <p className="cart-item-detail">Sauce: {item.sauce}</p>}
                  {item.drink    && <p className="cart-item-detail">Drink: {item.drink}</p>}
                  {item.toppings?.length > 0 && (
                    <p className="cart-item-detail">Toppings: {item.toppings.join(", ")}</p>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <div className="quantity-box">
                    <button className="qty-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span className="qty-count">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                  </div>
                  <p className="item-total-price">₹{item.price * item.quantity}</p>
                  <button className="btn-danger" onClick={() => handleRemoveItem(item)}>Remove</button>
                </div>
              </div>
            ))}

            <button className="btn-outline" style={{ marginTop: '10px' }} onClick={() => navigate("/home")}>
              ← Continue Shopping
            </button>
          </div>

          {/* RIGHT — Promo + Bill + Checkout */}
          <div className="cart-right">

            <div className="promo-section">
              <p className="input-label">🏷️ Promo Code</p>
              {appliedPromo ? (
                <div className="promo-applied">
                  <span>✅ <strong>{appliedPromo}</strong> — {discountPercent}% off!</span>
                  <button className="promo-remove-btn" onClick={handleRemovePromo}>Remove</button>
                </div>
              ) : (
                <div className="promo-input-row">
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                  />
                  <button className="btn-outline" onClick={handleApplyPromo}>Apply</button>
                </div>
              )}
              {promoError && <p className="promo-error">{promoError}</p>}
              <p className="promo-hint">Try: HEAT10 or PIZZA20</p>
            </div>

            <div className="bill-breakdown">
              <div className="bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              {discountAmount > 0 && (
                <div className="bill-row discount-row">
                  <span>Discount ({discountPercent}%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="bill-row"><span>GST (18%)</span><span>₹{gst}</span></div>
              <div className="bill-row total-row"><span>Grand Total</span><span>₹{grandTotal}</span></div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '8px' }}
              onClick={() => navigate("/order")}
            >
              Proceed to Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;