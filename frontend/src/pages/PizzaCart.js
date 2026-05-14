import axios from 'axios';
import { useCart } from '../context/CartContext';
import './PizzaCart.css';

const CartPage = () => {
  const { cart, adjustQuantity, removePizza, calculateTotal } = useCart();

  const handlePayment = async () => {
    try {
      const totalAmount = calculateTotal();

      const res = await axios.post('http://localhost:5000/api/payment/create-order', {
        amount: totalAmount * 100, // Amount in paise for Razorpay
      });

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // ✅ Replace with your real Razorpay Key
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'Pizza Order',
        description: 'Pizza Order Checkout',
        order_id: res.data.id,
        handler: function (response) {
          alert('✅ Payment Successful! Order placed.');
          // You can clear cart or redirect to order summary page here
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment Error:', err);
      alert('❌ Payment failed. Please try again.');
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          {cart.map((pizza) => (
            <div key={pizza.id} className="cart-item">
              <h3>{pizza.name}</h3>
              <p>Price: ${pizza.price}</p>
              <div>
                <button onClick={() => adjustQuantity(pizza.id, -1)} disabled={pizza.quantity <= 1}>-</button>
                <span> Quantity: {pizza.quantity} </span>
                <button onClick={() => adjustQuantity(pizza.id, 1)}>+</button>
              </div>
              <button onClick={() => removePizza(pizza.id)}>Remove</button>
            </div>
          ))}
          <h2>Total Price: ${calculateTotal()}</h2>
          <button onClick={handlePayment}>Pay & Place Order</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
