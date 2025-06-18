import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Anya's Crochet</h1>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/cart" className="navbar-link">Cart</Link>
          <Link to="/checkout" className="navbar-link">Checkout</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;