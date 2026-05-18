import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

// Pizza data for global search
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
    const { user, logout }         = useAuth();
    const { cartItems, clearCart } = useCart();
    const navigate                 = useNavigate();

    const [menuOpen, setMenuOpen]       = useState(false);
    const [searchOpen, setSearchOpen]   = useState(false);
    const [searchTerm, setSearchTerm]   = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const menuRef   = useRef(null);
    const searchRef = useRef(null);

    const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchOpen(false);
                setSearchTerm('');
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Real-time search
    const handleSearch = (val) => {
        setSearchTerm(val);
        if (val.trim().length < 1) {
            setSearchResults([]);
            return;
        }
        const results = ALL_PIZZAS.filter(p =>
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            p.category.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 6); // Max 6 results
        setSearchResults(results);
    };

    const handleResultClick = (pizza) => {
        navigate(`/pizza/${pizza.id}`);
        setSearchTerm('');
        setSearchResults([]);
        setSearchOpen(false);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/home?search=${encodeURIComponent(searchTerm)}`);
            setSearchOpen(false);
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    const handleLogout = () => {
        clearCart();
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    const go = (path) => { navigate(path); setMenuOpen(false); };

    return (
        <header className="navbar">
            <h1 className="navbar-logo" onClick={() => navigate(user ? "/home" : "/")}>
                HeatTreat Pizza
            </h1>

            <nav className="navbar-links">
                {!user ? (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/story">Our Story</Link>
                        <Link to="/contact">Contact</Link>
                        <button onClick={() => navigate("/login")} className="navbar-btn">Login</button>
                    </>
                ) : (
                    <>
                        <Link to="/home">Menu</Link>
                        <Link to="/story">Our Story</Link>
                        <Link to="/contact">Contact</Link>

                        {/* ✅ Global Search */}
                        <div className="navbar-search-wrapper" ref={searchRef}>
                            {searchOpen ? (
                                <div className="navbar-search-box">
                                    <input
                                        autoFocus
                                        type="text"
                                        className="navbar-search-input"
                                        placeholder="🔍 Pizza dhundho..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onKeyDown={handleSearchSubmit}
                                    />
                                    <button
                                        className="navbar-search-close"
                                        onClick={() => { setSearchOpen(false); setSearchTerm(''); setSearchResults([]); }}
                                    >✕</button>

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="navbar-search-results">
                                            {searchResults.map(pizza => (
                                                <div
                                                    key={pizza.id}
                                                    className="navbar-search-item"
                                                    onClick={() => handleResultClick(pizza)}
                                                >
                                                    <span className="search-item-emoji">🍕</span>
                                                    <div className="search-item-info">
                                                        <span className="search-item-name">{pizza.name}</span>
                                                        <span className="search-item-meta">
                                                            {pizza.category} • ₹{pizza.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                className="navbar-search-all"
                                                onClick={() => { navigate('/home'); setSearchOpen(false); }}
                                            >
                                                🔍 Saare pizzas dekho →
                                            </div>
                                        </div>
                                    )}

                                    {searchTerm.length > 0 && searchResults.length === 0 && (
                                        <div className="navbar-search-results">
                                            <div className="navbar-search-empty">
                                                😕 "{searchTerm}" nahi mila
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    className="navbar-search-btn"
                                    onClick={() => setSearchOpen(true)}
                                    title="Search Pizza"
                                >
                                    🔍
                                </button>
                            )}
                        </div>

                        <Link to="/cart" className="navbar-cart">
                            🛒 Cart
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>

                        {user.role === "admin" && (
                            <Link to="/admin-dashboard" className="admin-link">⚙️ Admin</Link>
                        )}

                        {/* Account Dropdown */}
                        <div className="account-menu-wrapper" ref={menuRef}>
                            <button
                                className="account-icon-btn"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                <span className="navbar-avatar">
                                    {(user.name || user.username || 'U').slice(0, 1).toUpperCase()}
                                </span>
                            </button>

                            {menuOpen && (
                                <div className="account-dropdown">
                                    <div className="dropdown-user">
                                        👤 {user.name || user.email || "User"}
                                        {user.role === "admin" && <span className="admin-badge">Admin</span>}
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <div className="dropdown-item" onClick={() => go("/home")}>🍕 Menu</div>
                                    <div className="dropdown-item" onClick={() => go("/cart")}>
                                        🛒 My Cart {totalItems > 0 && `(${totalItems})`}
                                    </div>
                                    <div className="dropdown-item" onClick={() => go("/profile")}>👤 My Profile</div>
                                    <div className="dropdown-item" onClick={() => go("/my-orders")}>🧾 My Orders</div>
                                    <div className="dropdown-item" onClick={() => go("/story")}>📖 Our Story</div>
                                    <div className="dropdown-item" onClick={() => go("/contact")}>📞 Contact</div>
                                    {user.role === "admin" && (
                                        <div className="dropdown-item" onClick={() => go("/admin-dashboard")}>⚙️ Admin Dashboard</div>
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