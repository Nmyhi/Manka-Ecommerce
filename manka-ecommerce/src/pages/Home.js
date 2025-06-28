import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <header className="home-hero">
        <h1>Handmade Crochet by Manka</h1>
        <p>Soft, cozy, and crafted with love. Discover one-of-a-kind crochet creations.</p>
      </header>

      <section className="home-section">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {/* Placeholder product cards */}
          <div className="product-card">Crochet Bunny</div>
          <div className="product-card">Mini Whale</div>
          <div className="product-card">Baby Octopus</div>
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
