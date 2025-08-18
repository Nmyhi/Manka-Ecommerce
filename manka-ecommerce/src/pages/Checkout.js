// ✅ Checkout.js - in /src/pages
import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const initiateStripeCheckout = async () => {
      try {
        const response = await fetch('http://localhost:4242/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: cartItems }),
        });

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
          console.error('Stripe checkout failed:', data);
        }
      } catch (err) {
        console.error('Checkout error:', err);
      }
    };

    if (cartItems.length === 0) {
      navigate('/cart');
    } else {
      initiateStripeCheckout();
    }
  }, [cartItems, navigate]);

  return (
    <div className="checkout-page">
      <p>Redirecting to Stripe...</p>
    </div>
  );
};

export default Checkout;
