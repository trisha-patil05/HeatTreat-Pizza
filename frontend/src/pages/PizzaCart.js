import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SIZES    = ['Small', 'Medium', 'Large'];
const CRUSTS   = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
const TOPPINGS = ['Extra Cheese', 'Mushrooms', 'Olives', 'Jalapeños', 'Corn', 'Onions', 'Bell Peppers'];
const DRINKS   = ['None', 'Coke', 'Pepsi', 'Sprite', 'Lemonade'];
const SAUCES   = ['Tomato', 'BBQ', 'Pesto', 'White Sauce'];

const SIZE_PRICES  = { Small: 0, Medium: 30, Large: 60 };
const CRUST_PRICES = { 'Thin Crust': 0, 'Thick Crust': 20, 'Stuffed Crust': 50 };

export default function PizzaCart() {
  const navigate = useNavigate();

  const [size,     setSize]     = useState('Medium');
  const [crust,    setCrust]    = useState('Thin Crust');
  const [sauce,    setSauce]    = useState('Tomato');
  const [toppings, setToppings] = useState([]);
  const [drink,    setDrink]    = useState('None');
  const [qty,      setQty]      = useState(1);
  const [added,    setAdded]    = useState(false);

  const basePrice  = 250;
  const extraPrice = SIZE_PRICES[size] + CRUST_PRICES[crust] + toppings.length * 20;
  const unitPrice  = basePrice + extraPrice;
  const total      = unitPrice * qty;

  const toggleTopping = (t) =>
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleAddToCart = () => {
    const item = {
      id:       `custom-${size}-${crust}-${Date.now()}`,
      name:     `Custom Pizza (${size})`,
      price:    unitPrice,
      image:    '/pizzas/1.jpeg',
      size, crust, sauce, toppings, drink,
      quantity: qty
    };
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cart.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const OptionGroup = ({ label, options, selected, onSelect, prices }) => (
    <div className="pizza-option-group">
      <span className="pizza-option-label">{label}</span>
      <div className="pizza-options">
        {options.map(opt => (
          <button
            key={opt}
            className={`pizza-option-btn ${selected === opt || (Array.isArray(selected) && selected.includes(opt)) ? 'selected' : ''}`}
            onClick={() => Array.isArray(selected) ? toggleTopping(opt) : onSelect(opt)}
          >
            {opt}{prices && prices[opt] > 0 ? ` +₹${prices[opt]}` : ''}
            {label === 'Extra Toppings' && opt !== 'None' ? ' +₹20' : ''}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pizza-details-page">
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 className="page-title">🍕 Build Your Own Pizza</h2>
          <p style={{ color: '#888', marginTop: '8px' }}>Customize every detail — size, crust, toppings and more!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>

          {/* LEFT — Customizer */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px' }}>

            <OptionGroup label="Size"          options={SIZES}    selected={size}     onSelect={setSize}     prices={SIZE_PRICES} />
            <OptionGroup label="Crust"         options={CRUSTS}   selected={crust}    onSelect={setCrust}    prices={CRUST_PRICES} />
            <OptionGroup label="Sauce"         options={SAUCES}   selected={sauce}    onSelect={setSauce} />
            <OptionGroup label="Extra Toppings" options={TOPPINGS} selected={toppings} onSelect={toggleTopping} />
            <OptionGroup label="Add a Drink"   options={DRINKS}   selected={drink}    onSelect={setDrink} />

            {/* Quantity */}
            <div className="pizza-option-group">
              <span className="pizza-option-label">Quantity</span>
              <div className="quantity-box" style={{ width: 'fit-content' }}>
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-count">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>
          </div>

          {/* RIGHT — Summary */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', position: 'sticky', top: '80px' }}>
            <h3 style={{ color: 'var(--orange)', marginBottom: '20px', fontSize: '1.1rem' }}>Order Summary</h3>

            {[
              { label: 'Size',     value: `${size} (+₹${SIZE_PRICES[size]})` },
              { label: 'Crust',    value: `${crust} (+₹${CRUST_PRICES[crust]})` },
              { label: 'Sauce',    value: sauce },
              { label: 'Toppings', value: toppings.length > 0 ? toppings.join(', ') : 'None' },
              { label: 'Drink',    value: drink },
              { label: 'Qty',      value: qty },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px' }}>
                <span style={{ color: '#888' }}>{row.label}</span>
                <span style={{ color: '#f0f0f0', textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontSize: '16px', fontWeight: 700 }}>
              <span style={{ color: '#888' }}>Total</span>
              <span style={{ color: 'var(--orange)' }}>₹{total}</span>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '13px', marginTop: '20px', fontSize: '15px' }}
              onClick={handleAddToCart}
            >
              {added ? '✅ Added to Cart!' : `🛒 Add to Cart — ₹${total}`}
            </button>

            <button
              className="btn-outline"
              style={{ width: '100%', padding: '11px', marginTop: '10px' }}
              onClick={() => navigate('/cart')}
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}