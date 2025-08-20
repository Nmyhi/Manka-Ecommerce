// src/pages/Success.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Success = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // ✅ Clear the cart on successful checkout
  }, [clearCart]);

  return (
    <div className="success-page">
      <h1>Payment Successful 🎉</h1>
      <p>Thank you for your order! Your items will be on their way soon.</p>
      <Link to="/shop">Continue Shopping</Link>
    </div>
  );
};

export default Success;
