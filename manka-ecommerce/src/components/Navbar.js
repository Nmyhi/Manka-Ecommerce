import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.png';  // Correct relative import

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <img src={logo} alt="Manka Logo" className="navbar-logo" />
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Shop</Link>
          <Link to="/cart" className="navbar-link">Cart</Link>
          <Link to="/checkout" className="navbar-link">Checkout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
