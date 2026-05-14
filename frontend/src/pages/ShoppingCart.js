import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ShoppingCart.css";

function ShoppingCart() {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal
  } = useCart();

  return (
    <div className="shopping-cart-page">
      <div className="shopping-cart-container">
        <h2>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="empty-cart-box">
            <p>Shopping cart is empty</p>
            <button onClick={() => navigate("/home")}>Go to Menu</button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <img src={item.image} alt={item.name} className="cart-item-image" />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>₹{item.price}</p>
                    <p>Size: {item.size}</p>
                    <p>Crust: {item.crust}</p>
                    <p>Sauce: {item.sauce}</p>
                    <p>Drink: {item.drink}</p>
                    <p>Toppings: {item.toppings?.join(", ") || "None"}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-box">
                      <button onClick={() => decreaseQuantity(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>

                    <p className="item-total">₹{item.price * item.quantity}</p>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-box">
              <h3>Total: ₹{getCartTotal()}</h3>
              <button onClick={() => navigate("/order")}>Proceed to Order</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;