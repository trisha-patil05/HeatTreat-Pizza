import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const toppingsOptions = ['Olives', 'Onions', 'Peppers', 'Mushrooms', 'Jalapeños', 'Pineapple', 'Bacon', 'Cheese'];
const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
const crusts = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
const sauces = ['Tomato Sauce', 'Pesto Sauce', 'BBQ Sauce', 'Garlic Sauce'];
const drinks = ['Coke', 'Pepsi', 'Sprite', 'Lemonade', 'Iced Tea'];

const sizePriceMap = { Small: 0, Medium: 50, Large: 100, 'Extra Large': 150 };
const basePrice = 300;
const toppingPrice = 20;

const galleryImages = [
  '/pizzas/1.jpeg',
  '/pizzas/5.jpeg',
  '/pizzas/7.jpeg',
  '/pizzas/10.jpeg',
];

function PizzaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [toppings, setToppings] = useState([]);
  const [size, setSize] = useState('Medium');
  const [crust, setCrust] = useState('Thin Crust');
  const [sauce, setSauce] = useState('Tomato Sauce');
  const [drink, setDrink] = useState('Coke');
  const [selectedImage, setSelectedImage] = useState(0);
  const [priceFlash, setPriceFlash] = useState(false);
  const [toast, setToast] = useState('');

  const totalPrice = basePrice + sizePriceMap[size] + toppings.length * toppingPrice;

  useEffect(() => {
    setPriceFlash(true);
    const t = setTimeout(() => setPriceFlash(false), 400);
    return () => clearTimeout(t);
  }, [totalPrice]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleTopping = (t) =>
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleAddToCart = () => {
    addToCart({ id, name: `Pizza #${id}`, price: totalPrice, image: galleryImages[selectedImage], toppings, size, crust, sauce, drink });
    showToast('🍕 Pizza added to cart!');
    setTimeout(() => navigate('/cart'), 1500);
  };

  const handleOrder = () => {
    localStorage.setItem('orderData', JSON.stringify({ pizzaId: id, toppings, size, crust, sauce, drink, totalPrice }));
    navigate('/summary');
  };

  return (
    <div className="details-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="details-container">
        <h2 className="page-title">Customize Your Pizza #{id}</h2>
        <p className="page-subtitle">Choose your size, crust, toppings, sauce, and drink.</p>

        {/* 2 Column Layout */}
        <div className="details-two-col">

          {/* LEFT — Image Gallery */}
          <div className="details-left">
            <img
              src={galleryImages[selectedImage]}
              alt={`Pizza ${id}`}
              className="pizza-preview-image"
            />
            <div className="gallery-thumbnails">
              {galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`view ${i + 1}`}
                  className={`gallery-thumb ${selectedImage === i ? 'active-thumb' : ''}`}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>

            {/* Price Box on Left */}
            <div className={`price-box ${priceFlash ? 'price-flash' : ''}`} style={{ marginTop: '20px' }}>
              <p>Base Price: ₹{basePrice}</p>
              <p>Size Charge: ₹{sizePriceMap[size]}</p>
              <p>Toppings ({toppings.length}): ₹{toppings.length * toppingPrice}</p>
              <h3>Total: ₹{totalPrice}</h3>
            </div>

            <div className="details-btn-row" style={{ marginTop: '16px' }}>
              <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn-outline" onClick={handleOrder}>Place Order</button>
            </div>
          </div>

          {/* RIGHT — Options */}
          <div className="details-right">
            <div className="input-group">
              <label className="input-label">Size</label>
              <select className="input-field" value={size} onChange={(e) => setSize(e.target.value)}>
                {sizes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Crust</label>
              <select className="input-field" value={crust} onChange={(e) => setCrust(e.target.value)}>
                {crusts.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Sauce</label>
              <select className="input-field" value={sauce} onChange={(e) => setSauce(e.target.value)}>
                {sauces.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Drink</label>
              <select className="input-field" value={drink} onChange={(e) => setDrink(e.target.value)}>
                {drinks.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Toppings</label>
              <div className="toppings-grid">
                {toppingsOptions.map(top => (
                  <label key={top} className="topping-item">
                    <input type="checkbox" checked={toppings.includes(top)} onChange={() => toggleTopping(top)} />
                    {top}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PizzaDetails;