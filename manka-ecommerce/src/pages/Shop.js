// src/pages/Shop.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('priceAsc');
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'listings'));
      const allCategories = snapshot.docs
        .map(doc => doc.data().category)
        .filter(Boolean); // remove undefined/null
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]); // fallback
    }
  };

  const fetchListings = async (reset = false) => {
    setLoading(true);
    let q = collection(db, 'listings');

    if (category !== 'All') {
      q = query(q, where('category', '==', category));
    }

    if (sort === 'priceAsc') {
      q = query(q, orderBy('price', 'asc'));
    } else if (sort === 'priceDesc') {
      q = query(q, orderBy('price', 'desc'));
    }

    if (lastDoc && !reset) {
      q = query(q, limit(10), startAfter(lastDoc));
    } else {
      q = query(q, limit(10));
    }

    const snap = await getDocs(q);
    const listings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(reset ? listings : [...products, ...listings]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories(); // only once on mount
  }, []);

  useEffect(() => {
    fetchListings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort]);

  return (
    <div className="shop-container">
      <div className="shop-controls">
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="priceAsc">Price Ascending</option>
          <option value="priceDesc">Price Descending</option>
        </select>
      </div>

      <div className="products-grid">
        {products.map(prod => (
          <Link to={`/product/${prod.id}`} key={prod.id} className="product-card">
            <img src={prod.imageUrls?.[0] || 'placeholder.jpg'} alt={prod.title} />
            <h3>{prod.title}</h3>
            <p>£{prod.price}</p>
          </Link>
        ))}
      </div>

      {lastDoc && !loading && (
        <button onClick={() => fetchListings()} className="load-more-btn">
          Load More
        </button>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Shop;
