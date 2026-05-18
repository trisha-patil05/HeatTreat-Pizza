import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; // ✅ Global toast

const pizzas = [
  { id: 1,  name: 'Margherita',             price: 200, category: 'Veg',         image: '/pizzas/1.jpeg' },
  { id: 2,  name: 'Pepperoni',              price: 250, category: 'Non-Veg',     image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg' },
  { id: 3,  name: 'Veggie Delight',         price: 230, category: 'Veg',         image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg' },
  { id: 4,  name: 'BBQ Chicken',            price: 270, category: 'Non-Veg',     image: '/pizzas/2.jpg' },
  { id: 5,  name: 'Paneer Tikka',           price: 260, category: 'Veg,Spicy',   image: '/pizzas/5.jpeg' },
  { id: 6,  name: 'Hawaiian',               price: 240, category: 'Non-Veg',     image: '/pizzas/6.jpeg' },
  { id: 7,  name: 'Four Cheese',            price: 280, category: 'Veg',         image: '/pizzas/7.jpeg' },
  { id: 8,  name: 'Mexican Green Wave',     price: 250, category: 'Veg,Spicy',   image: '/pizzas/8.jpeg' },
  { id: 9,  name: 'Seafood Supreme',        price: 300, category: 'Non-Veg',     image: '/pizzas/9.jpg' },
  { id: 10, name: 'Mushroom and Truffle',   price: 320, category: 'Veg',         image: '/pizzas/10.jpeg' },
  { id: 11, name: 'Buffalo Chicken',        price: 290, category: 'Non-Veg,Spicy', image: '/pizzas/11(1).jpeg' },
  { id: 12, name: 'Pesto Chicken',          price: 280, category: 'Non-Veg',     image: '/pizzas/12.jpeg' },
  { id: 13, name: 'Smoked Salmon',          price: 350, category: 'Non-Veg',     image: '/pizzas/13.jpeg' },
  { id: 14, name: 'Cheese and Spinach',     price: 230, category: 'Veg',         image: '/pizzas/14.jpeg' },
  { id: 15, name: 'Tandoori Chicken',       price: 270, category: 'Non-Veg,Spicy', image: '/pizzas/15.jpeg' },
  { id: 16, name: 'Meat Lovers',            price: 330, category: 'Non-Veg',     image: '/pizzas/16.jpg' },
  { id: 17, name: 'Salami',                 price: 260, category: 'Non-Veg',     image: '/pizzas/17.jpeg' },
  { id: 18, name: 'Bianca',                 price: 250, category: 'Veg',         image: '/pizzas/18.jpeg' },
  { id: 19, name: 'Caprese',                price: 220, category: 'Veg',         image: '/pizzas/19.jpeg' },
  { id: 20, name: 'Prosciutto and Arugula', price: 290, category: 'Non-Veg',     image: '/pizzas/20.jpeg' },
  { id: 21, name: 'Eggplant Parmesan',      price: 260, category: 'Veg',         image: '/pizzas/21.jpeg' },
  { id: 22, name: 'Cheeseburger Pizza',     price: 280, category: 'Non-Veg',     image: '/pizzas/22.jpeg' },
  { id: 23, name: 'Breakfast Pizza',        price: 300, category: 'Non-Veg',     image: '/pizzas/23.jpeg' },
  { id: 24, name: 'Carbonara',              price: 310, category: 'Non-Veg',     image: '/pizzas/24.jpeg' },
  { id: 25, name: 'Peking Duck',            price: 350, category: 'Non-Veg',     image: '/pizzas/25.jpeg' },
  { id: 26, name: 'Zaatar',                 price: 220, category: 'Veg',         image: '/pizzas/26.jpeg' },
  { id: 27, name: 'Vegan Delight',          price: 240, category: 'Veg',         image: '/pizzas/27.jpeg' },
  { id: 28, name: 'Spinach and Artichoke',  price: 270, category: 'Veg',         image: '/pizzas/28.jpg' },
];

function HomePage() {
  const [searchTerm, setSearchTerm]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder]           = useState('default');
  const [loadingId, setLoadingId]           = useState(null); // ✅ Per-button loading

  const { addToCart }  = useCart();
  const { showToast }  = useToast(); // ✅ Global toast
  const navigate       = useNavigate();

  // ✅ Add to cart with loading state
  const handleAddToCart = (pizza) => {
    setLoadingId(pizza.id);
    setTimeout(() => {
      addToCart(pizza);
      showToast(`🍕 ${pizza.name} cart mein add ho gaya!`, "success");
      setLoadingId(null);
    }, 400); // Small delay for feel
  };

  let filteredPizzas = pizzas.filter(
    pizza =>
      pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || pizza.category.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  if (sortOrder === 'low')  filteredPizzas = [...filteredPizzas].sort((a, b) => a.price - b.price);
  if (sortOrder === 'high') filteredPizzas = [...filteredPizzas].sort((a, b) => b.price - a.price);

  return (
    <div className="home-container">
      <BannerCarousel />

      <section className="menu-heading-section">
        <h2>Explore Our Hottest Pizzas</h2>

        <div className="search-sort-row">
          <input
            type="text"
            placeholder="🔍 Search pizza..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

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

      {filteredPizzas.length === 0 ? (
        <div className="no-results">
          <p>😕 No pizzas found for "<strong>{searchTerm}</strong>"</p>
          <button className="btn-primary" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="pizza-list">
          {filteredPizzas.map((pizza) => (
            <div key={pizza.id} className="pizza-card">
              <img src={pizza.image} alt={pizza.name} className="pizza-image" />
              <h3>{pizza.name}</h3>
              <p>₹{pizza.price}</p>
              <div className="card-buttons">
                <button onClick={() => navigate(`/pizza/${pizza.id}`)}>
                  View Details
                </button>
                {/* ✅ Loading state per button */}
                <button
                  onClick={() => handleAddToCart(pizza)}
                  disabled={loadingId === pizza.id}
                >
                  {loadingId === pizza.id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;