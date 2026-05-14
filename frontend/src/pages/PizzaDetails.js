import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './PizzaDetails.css';

const toppingsOptions = ['Olives', 'Onions', 'Peppers', 'Mushrooms', 'Jalapeños', 'Pineapple', 'Bacon', 'Cheese'];
const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
const crusts = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
const sauces = ['Tomato Sauce', 'Pesto Sauce', 'BBQ Sauce', 'Garlic Sauce'];
const drinks = ['Coke', 'Pepsi', 'Sprite', 'Lemonade', 'Iced Tea'];

function PizzaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [toppings, setToppings] = useState([]);
  const [size, setSize] = useState('Medium');
  const [crust, setCrust] = useState('Thin Crust');
  const [sauce, setSauce] = useState('Tomato Sauce');
  const [drink, setDrink] = useState('Coke');

  const basePrice = 300;
  const sizePriceMap = {
    Small: 0,
    Medium: 50,
    Large: 100,
    'Extra Large': 150,
  };
  const toppingPrice = 20;

  const totalPrice = basePrice + sizePriceMap[size] + toppings.length * toppingPrice;

  const toggleTopping = (topping) => {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id: id,
      name: `Pizza #${id}`,
      price: totalPrice,
      image: "/background/background2.jpg",
      toppings,
      size,
      crust,
      sauce,
      drink
    });

    alert("Pizza added to cart!");
    navigate("/cart");
  };

  const handleOrder = () => {
    localStorage.setItem(
      'orderData',
      JSON.stringify({ pizzaId: id, toppings, size, crust, sauce, drink, totalPrice })
    );
    navigate('/summary');
  };

  return (
    <div className="details-page">
      <div className="details-container">
        <h2>Customize Your Pizza #{id}</h2>
        <p className="details-subtitle">
          Choose your size, crust, toppings, sauce, and drink.
        </p>

        <img
          src="/background/background2.jpg"
          alt={`Pizza ${id}`}
          className="pizza-preview-image"
        />

        <div className="option-container">
          <label>Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="option-container">
          <label>Crust</label>
          <select value={crust} onChange={(e) => setCrust(e.target.value)}>
            {crusts.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="option-container">
          <label>Sauce</label>
          <select value={sauce} onChange={(e) => setSauce(e.target.value)}>
            {sauces.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="option-container">
          <label>Toppings</label>
          <div className="toppings-container">
            {toppingsOptions.map((top) => (
              <label key={top} className="topping-checkbox">
                <input
                  type="checkbox"
                  checked={toppings.includes(top)}
                  onChange={() => toggleTopping(top)}
                />
                {top}
              </label>
            ))}
          </div>
        </div>

        <div className="option-container">
          <label>Drink</label>
          <select value={drink} onChange={(e) => setDrink(e.target.value)}>
            {drinks.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="price-summary">
          <p>Base Price: ₹{basePrice}</p>
          <p>Size Charge: ₹{sizePriceMap[size]}</p>
          <p>Toppings ({toppings.length}): ₹{toppings.length * toppingPrice}</p>
          <h3>Total Price: ₹{totalPrice}</h3>
        </div>

        <div className="button-container">
          <button onClick={handleAddToCart}>Add to Cart</button>
          <button onClick={handleOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetails;