import React, { useState, useEffect, useCallback } from 'react';
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
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('priceAsc');
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [feedback, setFeedback] = useState('');

  const { addToCart } = useCart();

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'listings'));
      const allCategories = snapshot.docs
        .map(doc => doc.data().category)
        .filter(Boolean);
      const uniqueCategories = [...new Set(allCategories)];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  // ✅ lastDoc passed as argument instead of dependency
  const fetchListings = useCallback(
    async (reset = false, startAfterDoc = null) => {
      setLoading(true);

      try {
        let q = collection(db, 'listings');

        if (category !== 'All') {
          q = query(q, where('category', '==', category));
        }

        if (sort === 'priceAsc') {
          q = query(q, orderBy('price', 'asc'));
        } else if (sort === 'priceDesc') {
          q = query(q, orderBy('price', 'desc'));
        }

        if (startAfterDoc && !reset) {
          q = query(q, limit(10), startAfter(startAfterDoc));
        } else {
          q = query(q, limit(10));
        }

        const snap = await getDocs(q);
        const listings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setProducts(reset ? listings : prev => [...prev, ...listings]);
        setLastDoc(snap.docs[snap.docs.length - 1]);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    },
    [category, sort] // ✅ lastDoc removed
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // ✅ only triggers on sort/category change
    fetchListings(true, null);
  }, [category, sort, fetchListings]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrls: product.imageUrls,
      quantity: 1,
    });
    setFeedback(`✔️ ${product.title} added to cart`);
    setTimeout(() => setFeedback(''), 2000);
  };

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

      {feedback && <div className="cart-feedback">{feedback}</div>}

      <div className="products-grid">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            <Link to={`/product/${prod.id}`}>
              <img src={prod.imageUrls?.[0] || 'placeholder.jpg'} alt={prod.title} />
              <h3>{prod.title}</h3>
              <p>£{prod.price}</p>
            </Link>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(prod)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {lastDoc && !loading && (
        <button
          onClick={() => fetchListings(false, lastDoc)}
          className="load-more-btn"
        >
          Load More
        </button>
      )}

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Shop;
