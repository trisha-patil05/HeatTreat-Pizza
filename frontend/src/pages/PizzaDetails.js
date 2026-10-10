import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const pizzas = [
  { id: 1,  name: 'Margherita',             price: 200, category: 'Veg',              image: '/pizzas/1.jpeg',     desc: 'Classic tomato sauce with fresh mozzarella and basil leaves.' },
  { id: 2,  name: 'Pepperoni',              price: 250, category: 'Non-Veg',          image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg', desc: 'Loaded with spicy pepperoni slices and melted mozzarella.' },
  { id: 3,  name: 'Veggie Delight',         price: 230, category: 'Veg',              image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg', desc: 'Fresh bell peppers, mushrooms, olives and onions.' },
  { id: 4,  name: 'BBQ Chicken',            price: 270, category: 'Non-Veg',          image: '/pizzas/2.jpg',      desc: 'Smoky BBQ chicken with caramelized onions and cheddar.' },
  { id: 5,  name: 'Paneer Tikka',           price: 260, category: 'Veg, Spicy',       image: '/pizzas/5.jpeg',     desc: 'Tandoori paneer with bell peppers and mint chutney base.' },
  { id: 6,  name: 'Hawaiian',               price: 240, category: 'Non-Veg',          image: '/pizzas/6.jpeg',     desc: 'Ham and pineapple with creamy mozzarella.' },
  { id: 7,  name: 'Four Cheese',            price: 280, category: 'Veg',              image: '/pizzas/7.jpeg',     desc: 'Mozzarella, cheddar, parmesan and gouda — cheese lovers dream.' },
  { id: 8,  name: 'Mexican Green Wave',     price: 250, category: 'Veg, Spicy',       image: '/pizzas/8.jpeg',     desc: 'Jalapenos, corn, black beans and salsa on herb base.' },
  { id: 9,  name: 'Seafood Supreme',        price: 300, category: 'Non-Veg',          image: '/pizzas/9.jpg',      desc: 'Shrimp, squid and fish with garlic butter sauce.' },
  { id: 10, name: 'Mushroom and Truffle',   price: 320, category: 'Veg',              image: '/pizzas/10.jpeg',    desc: 'Wild mushrooms with truffle oil and parmesan.' },
  { id: 11, name: 'Buffalo Chicken',        price: 290, category: 'Non-Veg, Spicy',   image: '/pizzas/11(1).jpeg', desc: 'Spicy buffalo chicken with blue cheese drizzle.' },
  { id: 12, name: 'Pesto Chicken',          price: 280, category: 'Non-Veg',          image: '/pizzas/12.jpeg',    desc: 'Grilled chicken on basil pesto with sun-dried tomatoes.' },
  { id: 13, name: 'Smoked Salmon',          price: 350, category: 'Non-Veg',          image: '/pizzas/13.jpeg',    desc: 'Norwegian smoked salmon with cream cheese and capers.' },
  { id: 14, name: 'Cheese and Spinach',     price: 230, category: 'Veg',              image: '/pizzas/14.jpeg',    desc: 'Fresh spinach with ricotta and mozzarella blend.' },
  { id: 15, name: 'Tandoori Chicken',       price: 270, category: 'Non-Veg, Spicy',   image: '/pizzas/15.jpeg',    desc: 'Marinated tandoori chicken with onions and green chutney.' },
  { id: 16, name: 'Meat Lovers',            price: 330, category: 'Non-Veg',          image: '/pizzas/16.jpg',     desc: 'Pepperoni, sausage, bacon and ground beef.' },
  { id: 17, name: 'Salami',                 price: 260, category: 'Non-Veg',          image: '/pizzas/17.jpeg',    desc: 'Italian salami with olives and roasted peppers.' },
  { id: 18, name: 'Bianca',                 price: 250, category: 'Veg',              image: '/pizzas/18.jpeg',    desc: 'White pizza with garlic oil, ricotta and fresh herbs.' },
  { id: 19, name: 'Caprese',                price: 220, category: 'Veg',              image: '/pizzas/19.jpeg',    desc: 'Fresh tomatoes, mozzarella and basil drizzled with olive oil.' },
  { id: 20, name: 'Prosciutto and Arugula', price: 290, category: 'Non-Veg',          image: '/pizzas/20.jpeg',    desc: 'Thin-sliced prosciutto with peppery arugula and parmesan.' },
  { id: 21, name: 'Eggplant Parmesan',      price: 260, category: 'Veg',              image: '/pizzas/21.jpeg',    desc: 'Breaded eggplant with marinara and melted mozzarella.' },
  { id: 22, name: 'Cheeseburger Pizza',     price: 280, category: 'Non-Veg',          image: '/pizzas/22.jpeg',    desc: 'Ground beef, pickles, mustard and cheddar on ketchup base.' },
  { id: 23, name: 'Breakfast Pizza',        price: 300, category: 'Non-Veg',          image: '/pizzas/23.jpeg',    desc: 'Eggs, bacon, sausage and cheese on cream base.' },
  { id: 24, name: 'Carbonara',              price: 310, category: 'Non-Veg',          image: '/pizzas/24.jpeg',    desc: 'Creamy carbonara sauce with pancetta and black pepper.' },
  { id: 25, name: 'Peking Duck',            price: 350, category: 'Non-Veg',          image: '/pizzas/25.jpeg',    desc: 'Shredded Peking duck with hoisin sauce and spring onions.' },
  { id: 26, name: 'Zaatar',                 price: 220, category: 'Veg',              image: '/pizzas/26.jpeg',    desc: 'Middle Eastern zaatar spice blend with olive oil and cheese.' },
  { id: 27, name: 'Vegan Delight',          price: 240, category: 'Veg',              image: '/pizzas/27.jpeg',    desc: 'Plant-based toppings with vegan cheese on herb base.' },
  { id: 28, name: 'Spinach and Artichoke',  price: 270, category: 'Veg',              image: '/pizzas/28.jpg',     desc: 'Creamy spinach artichoke dip spread with melted cheese.' },
];

const SIZES    = ['Small', 'Medium', 'Large'];
const CRUSTS   = ['Thin', 'Thick', 'Stuffed'];
const SAUCES   = ['Tomato', 'BBQ', 'White', 'Pesto'];
const TOPPINGS = ['Extra Cheese', 'Olives', 'Mushrooms', 'Jalapeños', 'Corn', 'Onions'];
const DRINKS   = ['None', 'Coke', 'Pepsi', 'Sprite', 'Water'];

const SIZE_PRICES  = { Small: 0, Medium: 30, Large: 60 };
const CRUST_PRICES = { Thin: 0, Thick: 20, Stuffed: 50 };

export default function PizzaDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const pizza = pizzas.find(p => p.id === parseInt(id));

  const [size,     setSize]     = useState('Medium');
  const [crust,    setCrust]    = useState('Thin');
  const [sauce,    setSauce]    = useState('Tomato');
  const [toppings, setToppings] = useState([]);
  const [drink,    setDrink]    = useState('None');
  const [added,    setAdded]    = useState(false);

  if (!pizza) return (
    <div className="pizza-details-page">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#888', marginBottom: '20px' }}>🍕 Pizza not found!</p>
        <button className="btn-primary" onClick={() => navigate('/home')}>Back to Menu</button>
      </div>
    </div>
  );

  const toggleTopping = (t) =>
    setToppings(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const totalPrice = pizza.price + SIZE_PRICES[size] + CRUST_PRICES[crust];

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const item = {
      id:       `${pizza.id}-${size}-${crust}`,
      name:     pizza.name,
      price:    totalPrice,
      image:    pizza.image,
      size, crust, sauce, toppings, drink,
      quantity: 1
    };
    const existing = cart.findIndex(c => c.id === item.id);
    if (existing >= 0) cart[existing].quantity += 1;
    else cart.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pizza-details-page">
      <div className="pizza-details-container">

        {/* Image */}
        <div>
          <img src={pizza.image} alt={pizza.name} className="pizza-details-image" />
        </div>

        {/* Info */}
        <div className="pizza-details-info">
          <h2>{pizza.name}</h2>
          <p style={{ color: '#bbb', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
            {pizza.desc}
          </p>
          <p className="pizza-details-price">₹{totalPrice}</p>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '20px' }}>
            Category: {pizza.category}
          </p>

          {/* Size */}
          <div className="pizza-option-group">
            <span className="pizza-option-label">Size</span>
            <div className="pizza-options">
              {SIZES.map(s => (
                <button key={s} className={`pizza-option-btn ${size === s ? 'selected' : ''}`}
                  onClick={() => setSize(s)}>
                  {s} {SIZE_PRICES[s] > 0 ? `+₹${SIZE_PRICES[s]}` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Crust */}
          <div className="pizza-option-group">
            <span className="pizza-option-label">Crust</span>
            <div className="pizza-options">
              {CRUSTS.map(c => (
                <button key={c} className={`pizza-option-btn ${crust === c ? 'selected' : ''}`}
                  onClick={() => setCrust(c)}>
                  {c} {CRUST_PRICES[c] > 0 ? `+₹${CRUST_PRICES[c]}` : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Sauce */}
          <div className="pizza-option-group">
            <span className="pizza-option-label">Sauce</span>
            <div className="pizza-options">
              {SAUCES.map(s => (
                <button key={s} className={`pizza-option-btn ${sauce === s ? 'selected' : ''}`}
                  onClick={() => setSauce(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div className="pizza-option-group">
            <span className="pizza-option-label">Extra Toppings</span>
            <div className="pizza-options">
              {TOPPINGS.map(t => (
                <button key={t} className={`pizza-option-btn ${toppings.includes(t) ? 'selected' : ''}`}
                  onClick={() => toggleTopping(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Drink */}
          <div className="pizza-option-group">
            <span className="pizza-option-label">Add a Drink</span>
            <div className="pizza-options">
              {DRINKS.map(d => (
                <button key={d} className={`pizza-option-btn ${drink === d ? 'selected' : ''}`}
                  onClick={() => setDrink(d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button className="btn-outline" onClick={() => navigate('/home')}>
              ← Back to Menu
            </button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
              {added ? '✅ Added to Cart!' : `🛒 Add to Cart — ₹${totalPrice}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}