import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logo from '../logo.png';
import { FiShoppingCart } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { cart = [] } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/">
          <img src={logo} alt="Manka Logo" className="navbar-logo" />
        </Link>

        <div className="navbar-links">
          <Link to="/account" className="navbar-link">Account</Link>
          <Link to="/shop" className="navbar-link">Shop</Link>

          <Link to="/cart" className="navbar-link cart-icon-wrapper">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </Link>

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
