// src/pages/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'listings', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="product-loading">Loading...</p>;
  if (!product) return <p className="product-error">Product not found.</p>;

  return (
    <div className="product-detail-container">
      <Link to="/shop" className="back-link">← Back to Shop</Link>

      <div className="product-detail">
        <div className="product-images">
          {product.imageUrls?.map((url, index) => (
            <img key={index} src={url} alt={`${product.title} ${index + 1}`} />
          ))}
        </div>
        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="product-price">{product.price}Ft</p>
          <p className="product-description">{product.description}</p>
          {/* Add "Add to cart" or "Buy now" here later */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
