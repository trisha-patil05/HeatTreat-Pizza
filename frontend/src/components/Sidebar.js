import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🍕 PizzaApp</h2>
      <nav>
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/menu" className="nav-link">Pizza Menu</NavLink>
        <NavLink to="/orders" className="nav-link">Your Orders</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;