import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ALL_PIZZAS = [
  { id: 1,  name: 'Margherita',             price: 200, category: 'Veg' },
  { id: 2,  name: 'Pepperoni',              price: 250, category: 'Non-Veg' },
  { id: 3,  name: 'Veggie Delight',         price: 230, category: 'Veg' },
  { id: 4,  name: 'BBQ Chicken',            price: 270, category: 'Non-Veg' },
  { id: 5,  name: 'Paneer Tikka',           price: 260, category: 'Veg,Spicy' },
  { id: 6,  name: 'Hawaiian',               price: 240, category: 'Non-Veg' },
  { id: 7,  name: 'Four Cheese',            price: 280, category: 'Veg' },
  { id: 8,  name: 'Mexican Green Wave',     price: 250, category: 'Veg,Spicy' },
  { id: 9,  name: 'Seafood Supreme',        price: 300, category: 'Non-Veg' },
  { id: 10, name: 'Mushroom and Truffle',   price: 320, category: 'Veg' },
  { id: 11, name: 'Buffalo Chicken',        price: 290, category: 'Non-Veg,Spicy' },
  { id: 12, name: 'Pesto Chicken',          price: 280, category: 'Non-Veg' },
  { id: 13, name: 'Smoked Salmon',          price: 350, category: 'Non-Veg' },
  { id: 14, name: 'Cheese and Spinach',     price: 230, category: 'Veg' },
  { id: 15, name: 'Tandoori Chicken',       price: 270, category: 'Non-Veg,Spicy' },
  { id: 16, name: 'Meat Lovers',            price: 330, category: 'Non-Veg' },
  { id: 17, name: 'Salami',                 price: 260, category: 'Non-Veg' },
  { id: 18, name: 'Bianca',                 price: 250, category: 'Veg' },
  { id: 19, name: 'Caprese',                price: 220, category: 'Veg' },
  { id: 20, name: 'Prosciutto and Arugula', price: 290, category: 'Non-Veg' },
  { id: 21, name: 'Eggplant Parmesan',      price: 260, category: 'Veg' },
  { id: 22, name: 'Cheeseburger Pizza',     price: 280, category: 'Non-Veg' },
  { id: 23, name: 'Breakfast Pizza',        price: 300, category: 'Non-Veg' },
  { id: 24, name: 'Carbonara',              price: 310, category: 'Non-Veg' },
  { id: 25, name: 'Peking Duck',            price: 350, category: 'Non-Veg' },
  { id: 26, name: 'Zaatar',                 price: 220, category: 'Veg' },
  { id: 27, name: 'Vegan Delight',          price: 240, category: 'Veg' },
  { id: 28, name: 'Spinach and Artichoke',  price: 270, category: 'Veg' },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const menuRef   = useRef(null);
  const searchRef = useRef(null);

  const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
  const [user, setUser] = useState(getUser);

  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      return cart.reduce((s, i) => s + (i.quantity || 1), 0);
    } catch { return 0; }
  };
  const [cartCount, setCartCount] = useState(getCartCount);

  const [menuOpen,   setMenuOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results,    setResults]    = useState([]);

  // Refresh user + cart on storage change
  useEffect(() => {
    const handler = () => { setUser(getUser()); setCartCount(getCartCount()); };
    window.addEventListener('storage', handler);
    const interval = setInterval(handler, 500);
    return () => { window.removeEventListener('storage', handler); clearInterval(interval); };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current   && !menuRef.current.contains(e.target))   setMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchOpen(false); setSearchTerm(''); setResults([]); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (val) => {
    setSearchTerm(val);
    if (!val.trim()) { setResults([]); return; }
    setResults(ALL_PIZZAS.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.category.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 6));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    setUser(null);
    setMenuOpen(false);
    navigate('/');
  };

  const go = (path) => { navigate(path); setMenuOpen(false); };

  return (
    <header className="navbar">
      {/* Logo */}
      <h1 className="navbar-logo" onClick={() => navigate(user ? '/home' : '/')}>
        🍕 HeatTreat Pizza
      </h1>

      <nav className="navbar-links">
        {!user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/story">Our Story</Link>
            <Link to="/contact">Contact</Link>
            <button className="navbar-btn" onClick={() => navigate('/login')}>Login</button>
          </>
        ) : (
          <>
            <Link to="/home">Menu</Link>
            <Link to="/story">Our Story</Link>
            <Link to="/contact">Contact</Link>

            {/* Search */}
            <div className="navbar-search-wrapper" ref={searchRef}>
              {searchOpen ? (
                <div className="navbar-search-box">
                  <input
                    autoFocus
                    type="text"
                    className="navbar-search-input"
                    placeholder="🔍 Search pizza..."
                    value={searchTerm}
                    onChange={e => handleSearch(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && searchTerm.trim()) {
                        navigate('/home'); setSearchOpen(false); setSearchTerm(''); setResults([]);
                      }
                    }}
                  />
                  <button className="navbar-search-close" onClick={() => { setSearchOpen(false); setSearchTerm(''); setResults([]); }}>✕</button>

                  {results.length > 0 && (
                    <div className="navbar-search-results">
                      {results.map(p => (
                        <div key={p.id} className="navbar-search-item"
                          onClick={() => { navigate(`/pizza/${p.id}`); setSearchOpen(false); setSearchTerm(''); setResults([]); }}>
                          <span className="search-item-emoji">🍕</span>
                          <div>
                            <span className="search-item-name">{p.name}</span>
                            <span className="search-item-meta">{p.category} • ₹{p.price}</span>
                          </div>
                        </div>
                      ))}
                      <div className="navbar-search-all" onClick={() => { navigate('/home'); setSearchOpen(false); }}>
                        🔍 View all pizzas →
                      </div>
                    </div>
                  )}

                  {searchTerm && results.length === 0 && (
                    <div className="navbar-search-results">
                      <div className="navbar-search-empty">😕 No pizza found for "{searchTerm}"</div>
                    </div>
                  )}
                </div>
              ) : (
                <button className="navbar-search-btn" onClick={() => setSearchOpen(true)}>🔍</button>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="navbar-cart">
              🛒 Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Admin link */}
            {user?.role === 'admin' && (
              <Link to="/admin-dashboard" className="admin-link">⚙️ Admin</Link>
            )}

            {/* Account dropdown */}
            <div className="account-menu-wrapper" ref={menuRef}>
              <button className="navbar-avatar" onClick={() => setMenuOpen(p => !p)}>
                {(user?.name || user?.username || 'U')[0].toUpperCase()}
              </button>

              {menuOpen && (
                <div className="account-dropdown">
                  <div className="dropdown-user">
                    👤 {user?.name || user?.username || 'User'}
                    {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
                  </div>
                  <hr className="dropdown-divider" />
                  <div className="dropdown-item" onClick={() => go('/home')}>🍕 Menu</div>
                  <div className="dropdown-item" onClick={() => go('/cart')}>
                    🛒 Cart {cartCount > 0 && `(${cartCount})`}
                  </div>
                  <div className="dropdown-item" onClick={() => go('/profile')}>👤 My Profile</div>
                  <div className="dropdown-item" onClick={() => go('/my-orders')}>🧾 My Orders</div>
                  <div className="dropdown-item" onClick={() => go('/story')}>📖 Our Story</div>
                  <div className="dropdown-item" onClick={() => go('/contact')}>📞 Contact</div>
                  {user?.role === 'admin' && (
                    <div className="dropdown-item" onClick={() => go('/admin-dashboard')}>⚙️ Admin Dashboard</div>
                  )}
                  <hr className="dropdown-divider" />
                  <div className="dropdown-item logout-item" onClick={handleLogout}>🚪 Logout</div>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
}