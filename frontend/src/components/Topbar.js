import { Link } from 'react-router-dom';
import './Topbar.css';

function Topbar({ cartItemCount = 0 }) {
  return (
    <div className="topbar">
      <Link to="/" className="logo">🍕 Pizza App</Link>

      <input
        className="search-input"
        type="text"
        placeholder="Search pizza..."
      />

      <div className="topbar-icons">
        <Link to="/cart" className="cart-icon">
          🛒 <span className="cart-count">{cartItemCount}</span>
        </Link>

        <div className="dropdown">
          <div className="account-icon">👤</div>
          <div className="dropdown-menu">
            <Link to="/login">Login</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/address">Address</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
