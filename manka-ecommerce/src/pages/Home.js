// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'listings'),
          where('featured', '==', true),
          limit(6) // limit to 6 featured items
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeatured(data);
      } catch (err) {
        console.error('Error fetching featured listings:', err.message);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="home">
      <header className="home-hero">
        <h1>Handmade Crochet by Manka</h1>
        <p>Soft, cozy, and crafted with love. Discover one-of-a-kind crochet creations.</p>
      </header>

      <section className="home-section">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {featured.length > 0 ? (
            featured.map(prod => (
              <Link to={`/product/${prod.id}`} key={prod.id} className="product-card">
                <img src={prod.imageUrls?.[0] || 'placeholder.jpg'} alt={prod.title} />
                <h3>{prod.title}</h3>
                <p>£{prod.price}</p>
              </Link>
            ))
          ) : (
            <p>No featured listings yet.</p>
          )}
        </div>
      </section>

      <section className="home-section">
        <h2>About Manka</h2>
        <p>
          Manka creates charming crochet pieces inspired by nature, animals, and joy.
          Each item is handmade with care, perfect for gifts, nursery decor, or collectors.
        </p>
      </section>
    </div>
  );
};

export default Home;
