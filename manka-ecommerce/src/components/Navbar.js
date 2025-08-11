import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <img src={logo} alt="Manka Logo" className="navbar-logo" />
        </Link>
        <div className="navbar-links">
          <Link to="/account" className="navbar-link">Account</Link>
          <Link to="/shop" className="navbar-link">Shop</Link>
          <Link to="/cart" className="navbar-link">Cart</Link>
          <Link to="/checkout" className="navbar-link">Checkout</Link>
        </div>
        {user && (
          <div className="navbar-user">
            <img src={user.photoURL} alt="Profile" className="navbar-avatar" />
            <span>{user.displayName || user.email}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
