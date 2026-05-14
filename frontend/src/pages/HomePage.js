import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import './HomePage.css';

const pizzas = [
  { id: 1, name: 'Margherita', price: 200, category: 'Veg', image: '/pizzas/1.jpeg' },
  { id: 2, name: 'Pepperoni', price: 250, category: 'Non-Veg', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg' },
  { id: 3, name: 'Veggie Delight', price: 230, category: 'Veg', image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg' },
  { id: 4, name: 'BBQ Chicken', price: 270, category: 'Non-Veg', image: '/pizzas/2.jpg' },
  { id: 5, name: 'Paneer Tikka', price: 260, category: 'Veg,Spicy', image: '/pizzas/5.jpeg' },
  { id: 6, name: 'Hawaiian', price: 240, category: 'Non-Veg', image: '/pizzas/6.jpeg' },
  { id: 7, name: 'Four Cheese', price: 280, category: 'Veg', image: '/pizzas/7.jpeg' },
  { id: 8, name: 'Mexican Green Wave', price: 250, category: 'Veg,Spicy', image: '/pizzas/8.jpeg' },
  { id: 9, name: 'Seafood Supreme', price: 300, category: 'Non-Veg', image: '/pizzas/9.jpg' },
  { id: 10, name: 'Mushroom and Truffle', price: 320, category: 'Veg', image: '/pizzas/10.jpeg' },
  { id: 11, name: 'Buffalo Chicken', price: 290, category: 'Non-Veg,Spicy', image: '/pizzas/11(1).jpeg' },
  { id: 12, name: 'Pesto Chicken', price: 280, category: 'Non-Veg', image: '/pizzas/12.jpeg' },
  { id: 13, name: 'Smoked Salmon', price: 350, category: 'Non-Veg', image: '/pizzas/13.jpeg' },
  { id: 14, name: 'Cheese and Spinach', price: 230, category: 'Veg', image: '/pizzas/14.jpeg' },
  { id: 15, name: 'Tandoori Chicken', price: 270, category: 'Non-Veg,Spicy', image: '/pizzas/15.jpeg' },
  { id: 16, name: 'Meat Lovers', price: 330, category: 'Non-Veg', image: '/pizzas/16.jpg' },
  { id: 17, name: 'Salami', price: 260, category: 'Non-Veg', image: '/pizzas/17.jpeg' },
  { id: 18, name: 'Bianca', price: 250, category: 'Veg', image: '/pizzas/18.jpeg' },
  { id: 19, name: 'Caprese', price: 220, category: 'Veg', image: '/pizzas/19.jpeg' },
  { id: 20, name: 'Prosciutto and Arugula', price: 290, category: 'Non-Veg', image: '/pizzas/20.jpeg' },
  { id: 21, name: 'Eggplant Parmesan', price: 260, category: 'Veg', image: '/pizzas/21.jpeg' },
  { id: 22, name: 'Cheeseburger Pizza', price: 280, category: 'Non-Veg', image: '/pizzas/22.jpeg' },
  { id: 23, name: 'Breakfast Pizza', price: 300, category: 'Non-Veg', image: '/pizzas/23.jpeg' },
  { id: 24, name: 'Carbonara', price: 310, category: 'Non-Veg', image: '/pizzas/24.jpeg' },
  { id: 25, name: 'Peking Duck', price: 350, category: 'Non-Veg', image: '/pizzas/25.jpeg' },
  { id: 26, name: 'Zaatar', price: 220, category: 'Veg', image: '/pizzas/26.jpeg' },
  { id: 27, name: 'Vegan Delight', price: 240, category: 'Veg', image: '/pizzas/27.jpeg' },
  { id: 28, name: 'Spinach and Artichoke', price: 270, category: 'Veg', image: '/pizzas/28.jpg' },
];

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const closeMenu = () => setIsAccountMenuOpen(false);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItemCount(storedCart.reduce((acc, item) => acc + item.quantity, 0));
  }, []);

  const addToCart = (pizza) => {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const found = existingCart.find(item => item.id === pizza.id);

    if (found) {
      found.quantity += 1;
    } else {
      existingCart.push({ ...pizza, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    setCartItemCount(existingCart.reduce((acc, item) => acc + item.quantity, 0));
    alert(`${pizza.name} added to cart!`);
  };

  const filteredPizzas = pizzas.filter(
    pizza =>
      pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || pizza.category.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  return (
    <div className="home-container">
      <header className="homepage-header">
        <div className="header-left">
          <h1 className="heattreat-logo-text">HeatTreat Pizza</h1>
        </div>

        <div className="search-and-menu">
          <input
            type="text"
            placeholder="Search pizza..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="cart-btn" onClick={() => navigate("/cart")}>
            🛒 Cart ({cartItemCount})
          </button>

          <div className="menu-container">
            <span
              className="account-icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsAccountMenuOpen(prev => !prev);
              }}
            >
              ☰
            </span>

            {isAccountMenuOpen && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="menu-header">My Account</div>
                <div className="menu-items">
                  <div className="menu-item">❤️ Favorites</div>
                  <div className="menu-item">📍 Address</div>
                  <div className="menu-item">🧾 Orders</div>
                  <div className="menu-item">❓ Help</div>
                  <div className="menu-item">⚙️ Settings</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <BannerCarousel />

      <section className="menu-heading-section">
        <h2>Explore Our Hottest Pizzas</h2>
        <div className="category-filters">
          {["All", "Veg", "Non-Veg", "Spicy"].map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active-filter" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="pizza-list">
        {filteredPizzas.map((pizza) => (
          <div key={pizza.id} className="pizza-card">
            <img src={pizza.image} alt={pizza.name} className="pizza-image" />
            <h3>{pizza.name}</h3>
            <p>₹{pizza.price}</p>
            <div className="card-buttons">
              <button onClick={() => navigate(`/pizza/${pizza.id}`)}>View Details</button>
              <button onClick={() => addToCart(pizza)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;