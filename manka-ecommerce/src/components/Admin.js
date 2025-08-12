// src/components/Admin.js
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [listing, setListing] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !imageFile) return alert('User must be logged in and image selected.');

    try {
      const storage = getStorage();
      const imageRef = ref(storage, `listings/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'listings'), {
        ...listing,
        imageUrl,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      alert('Listing uploaded successfully');
      setListing({ title: '', description: '', price: '', category: '' });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert('Error uploading listing');
    }
  };

  return (
    <div className="admin-container">
      <h2>Upload New Listing</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input name="title" placeholder="Title" value={listing.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={listing.description} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={listing.price} onChange={handleChange} required type="number" />
        <input name="category" placeholder="Category" value={listing.category} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
        <button type="submit">Upload Listing</button>
      </form>
    </div>
  );
};

export default Admin;
