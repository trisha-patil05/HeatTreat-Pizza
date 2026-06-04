import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const pizzas = [
  { id: 1,  name: 'Margherita',             price: 200, category: 'Veg',           image: '/pizzas/1.jpeg' },
  { id: 2,  name: 'Pepperoni',              price: 250, category: 'Non-Veg',       image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Pepperoni_pizza.jpg' },
  { id: 3,  name: 'Veggie Delight',         price: 230, category: 'Veg',           image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg' },
  { id: 4,  name: 'BBQ Chicken',            price: 270, category: 'Non-Veg',       image: '/pizzas/2.jpg' },
  { id: 5,  name: 'Paneer Tikka',           price: 260, category: 'Veg,Spicy',     image: '/pizzas/5.jpeg' },
  { id: 6,  name: 'Hawaiian',               price: 240, category: 'Non-Veg',       image: '/pizzas/6.jpeg' },
  { id: 7,  name: 'Four Cheese',            price: 280, category: 'Veg',           image: '/pizzas/7.jpeg' },
  { id: 8,  name: 'Mexican Green Wave',     price: 250, category: 'Veg,Spicy',     image: '/pizzas/8.jpeg' },
  { id: 9,  name: 'Seafood Supreme',        price: 300, category: 'Non-Veg',       image: '/pizzas/9.jpg' },
  { id: 10, name: 'Mushroom and Truffle',   price: 320, category: 'Veg',           image: '/pizzas/10.jpeg' },
  { id: 11, name: 'Buffalo Chicken',        price: 290, category: 'Non-Veg,Spicy', image: '/pizzas/11(1).jpeg' },
  { id: 12, name: 'Pesto Chicken',          price: 280, category: 'Non-Veg',       image: '/pizzas/12.jpeg' },
  { id: 13, name: 'Smoked Salmon',          price: 350, category: 'Non-Veg',       image: '/pizzas/13.jpeg' },
  { id: 14, name: 'Cheese and Spinach',     price: 230, category: 'Veg',           image: '/pizzas/14.jpeg' },
  { id: 15, name: 'Tandoori Chicken',       price: 270, category: 'Non-Veg,Spicy', image: '/pizzas/15.jpeg' },
  { id: 16, name: 'Meat Lovers',            price: 330, category: 'Non-Veg',       image: '/pizzas/16.jpg' },
  { id: 17, name: 'Salami',                 price: 260, category: 'Non-Veg',       image: '/pizzas/17.jpeg' },
  { id: 18, name: 'Bianca',                 price: 250, category: 'Veg',           image: '/pizzas/18.jpeg' },
  { id: 19, name: 'Caprese',                price: 220, category: 'Veg',           image: '/pizzas/19.jpeg' },
  { id: 20, name: 'Prosciutto and Arugula', price: 290, category: 'Non-Veg',       image: '/pizzas/20.jpeg' },
  { id: 21, name: 'Eggplant Parmesan',      price: 260, category: 'Veg',           image: '/pizzas/21.jpeg' },
  { id: 22, name: 'Cheeseburger Pizza',     price: 280, category: 'Non-Veg',       image: '/pizzas/22.jpeg' },
  { id: 23, name: 'Breakfast Pizza',        price: 300, category: 'Non-Veg',       image: '/pizzas/23.jpeg' },
  { id: 24, name: 'Carbonara',              price: 310, category: 'Non-Veg',       image: '/pizzas/24.jpeg' },
  { id: 25, name: 'Peking Duck',            price: 350, category: 'Non-Veg',       image: '/pizzas/25.jpeg' },
  { id: 26, name: 'Zaatar',                 price: 220, category: 'Veg',           image: '/pizzas/26.jpeg' },
  { id: 27, name: 'Vegan Delight',          price: 240, category: 'Veg',           image: '/pizzas/27.jpeg' },
  { id: 28, name: 'Spinach and Artichoke',  price: 270, category: 'Veg',           image: '/pizzas/28.jpg' },
];

const ITEMS_PER_PAGE = 8;

function getAvgRating(pizzaId) {
  const reviews = JSON.parse(localStorage.getItem(`reviews_${pizzaId}`) || '[]');
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg: avg.toFixed(1), count: reviews.length };
}

function StarDisplay({ rating }) {
  return (
    <div className="star-display">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="pizza-card skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-price" />
      <div className="skeleton skeleton-rating" />
      <div className="skeleton-buttons">
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
      </div>
    </div>
  );
}

function HomePage() {
  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder]               = useState('default');
  const [loadingId, setLoadingId]               = useState(null);
  const [ratings, setRatings]                   = useState({});
  const [isLoading, setIsLoading]               = useState(true);
  const [currentPage, setCurrentPage]           = useState(1);

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate      = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const allRatings = {};
    pizzas.forEach(p => {
      const r = getAvgRating(p.id);
      if (r) allRatings[p.id] = r;
    });
    setRatings(allRatings);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOrder]);

  const handleAddToCart = (pizza) => {
    setLoadingId(pizza.id);
    setTimeout(() => {
      addToCart(pizza);
      showToast(`🍕 ${pizza.name} cart mein add ho gaya!`, "success");
      setLoadingId(null);
    }, 400);
  };

  let filteredPizzas = pizzas.filter(
    pizza =>
      pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || pizza.category.toLowerCase().includes(selectedCategory.toLowerCase()))
  );

  if (sortOrder === 'low')    filteredPizzas = [...filteredPizzas].sort((a, b) => a.price - b.price);
  if (sortOrder === 'high')   filteredPizzas = [...filteredPizzas].sort((a, b) => b.price - a.price);
  if (sortOrder === 'rating') filteredPizzas = [...filteredPizzas].sort((a, b) => {
    const ra = ratings[a.id]?.avg || 0;
    const rb = ratings[b.id]?.avg || 0;
    return rb - ra;
  });

  // Pagination
  const totalPages   = Math.ceil(filteredPizzas.length / ITEMS_PER_PAGE);
  const startIndex   = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPizzas = filteredPizzas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

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
          <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
            <option value="rating">⭐ Top Rated</option>
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

      {/* Skeleton */}
      {isLoading ? (
        <div className="pizza-list">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredPizzas.length === 0 ? (
        <div className="no-results">
          <p>😕 No pizzas found for "<strong>{searchTerm}</strong>"</p>
          <button className="btn-primary" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="results-count">
            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredPizzas.length)} of {filteredPizzas.length} pizzas
          </p>

          {/* Pizza Grid */}
          <div className="pizza-list">
            {paginatedPizzas.map((pizza) => (
              <div key={pizza.id} className="pizza-card">
                <img src={pizza.image} alt={pizza.name} className="pizza-image" />
                <h3>{pizza.name}</h3>
                <p>₹{pizza.price}</p>

                {ratings[pizza.id] ? (
                  <div className="card-rating">
                    <StarDisplay rating={ratings[pizza.id].avg} />
                    <span className="rating-text">{ratings[pizza.id].avg} ({ratings[pizza.id].count})</span>
                  </div>
                ) : (
                  <div className="card-rating">
                    <span className="no-rating">No ratings yet</span>
                  </div>
                )}

                <div className="card-buttons">
                  <button onClick={() => navigate(`/pizza/${pizza.id}`)}>View Details</button>
                  <button onClick={() => handleAddToCart(pizza)} disabled={loadingId === pizza.id}>
                    {loadingId === pizza.id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {/* Prev */}
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, i) =>
                page === '...' ? (
                  <span key={i} className="page-dots">...</span>
                ) : (
                  <button
                    key={i}
                    className={`page-btn ${currentPage === page ? 'active-page' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HomePage;