// ✅ Success.js - in /src/pages
import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="success-page">
      <h1>Payment Successful 🎉</h1>
      <p>Thank you for your order! Your items will be on their way soon.</p>
      <Link to="/shop">Continue Shopping</Link>
    </div>
  );
};

export default Success;