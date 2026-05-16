import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

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
                        <button onClick={() => navigate("/login")} className="navbar-btn">
                            Login
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/home">Menu</Link>
                        <Link to="/story">Our Story</Link>
                        <Link to="/contact">Contact</Link>

                        <Link to="/cart" className="navbar-cart">
                            🛒 Cart
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>

                        <div className="account-menu-wrapper" ref={menuRef}>
                            <button
                                className="account-icon-btn"
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                ☰
                            </button>

                            {menuOpen && (
                                <div className="account-dropdown">
                                    <div className="dropdown-user">
                                        👤 {user.name || user.email || "User"}
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <div className="dropdown-item" onClick={() => { navigate("/home"); setMenuOpen(false); }}>
                                        🍕 Menu
                                    </div>
                                    <div className="dropdown-item" onClick={() => { navigate("/cart"); setMenuOpen(false); }}>
                                        🛒 My Cart {totalItems > 0 && `(${totalItems})`}
                                    </div>
                                    <div className="dropdown-item" onClick={() => { navigate("/story"); setMenuOpen(false); }}>
                                        📖 Our Story
                                    </div>
                                    <div className="dropdown-item" onClick={() => { navigate("/contact"); setMenuOpen(false); }}>
                                        📞 Contact
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <div className="dropdown-item logout-item" onClick={handleLogout}>
                                        🚪 Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </nav>
        </header>
    );
}