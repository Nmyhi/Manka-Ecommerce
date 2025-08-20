// ✅ Checkout.js - fixed
import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart } = useCart(); // ✅ Correct key
  const navigate = useNavigate();

  useEffect(() => {
    const initiateStripeCheckout = async () => {
      try {
        const response = await fetch(
          'https://5000-nmyhi-mankaecommerce-vkkgd1216bn.ws-eu121.gitpod.io/create-checkout-session', // ✅ Corrected path
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart }),
          }
        );

        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error('Stripe checkout failed:', data);
        }
      } catch (err) {
        console.error('Checkout error:', err);
      }
    };

    if (!cart || cart.length === 0) {
      navigate('/cart');
    } else {
      initiateStripeCheckout();
    }
  }, [cart, navigate]);

  return (
    <div className="checkout-page">
      <p>Redirecting to Stripe...</p>
    </div>
  );
};

export default Checkout;
