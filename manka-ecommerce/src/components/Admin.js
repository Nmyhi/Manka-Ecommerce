// src/components/Admin.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
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
  const [imageFiles, setImageFiles] = useState([]);
  const [listings, setListings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchListings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const q = query(collection(db, 'listings'), where('createdBy', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err.message);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleChange = (e) => {
    setListing({ ...listing, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      alert('User not authenticated.');
      console.error('Submission blocked: user not authenticated.');
      return;
    }

    if (imageFiles.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    console.log('Attempting to upload listing as user:', user.uid);

    try {
      const storage = getStorage();
      const imageUrls = [];

      for (const file of imageFiles) {
        const imgRef = storageRef(storage, `listings/${Date.now()}_${file.name}`);
        await uploadBytes(imgRef, file);
        const url = await getDownloadURL(imgRef);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'listings'), {
        ...listing,
        imageUrls,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      alert('Listing uploaded.');
      setListing({ title: '', description: '', price: '', category: '' });
      setImageFiles([]);
      fetchListings();
    } catch (err) {
      console.error('Error uploading listing:', err.message);
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleEditStart = (listing) => {
    setEditingId(listing.id);
    setEditForm({ ...listing });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      const docRef = doc(db, 'listings', editingId);
      await updateDoc(docRef, {
        title: editForm.title,
        description: editForm.description,
        price: editForm.price,
        category: editForm.category,
      });
      alert('Listing updated');
      setEditingId(null);
      fetchListings();
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    }
  };

  const handleDelete = async (listing) => {
    const confirm = window.confirm('Delete this listing?');
    if (!confirm) return;

    try {
      const docRef = doc(db, 'listings', listing.id);
      await deleteDoc(docRef);

      const storage = getStorage();
      for (const url of listing.imageUrls || []) {
        const path = new URL(url).pathname.split('/o/')[1].split('?')[0];
        const decodedPath = decodeURIComponent(path);
        const imgRef = storageRef(storage, decodedPath);
        await deleteObject(imgRef);
      }

      alert('Listing deleted');
      fetchListings();
    } catch (err) {
      console.error(err);
      alert('Error deleting listing');
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
        <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} required />
        <button type="submit">Upload Listing</button>
      </form>

      <h2>Your Listings</h2>
      <div className="listing-grid">
        {listings.map(list => (
          <div key={list.id} className="listing-card">
            {editingId === list.id ? (
              <>
                <input name="title" value={editForm.title} onChange={handleEditChange} />
                <textarea name="description" value={editForm.description} onChange={handleEditChange} />
                <input name="price" type="number" value={editForm.price} onChange={handleEditChange} />
                <input name="category" value={editForm.category} onChange={handleEditChange} />
                <button onClick={handleEditSave}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <img src={list.imageUrls?.[0]} alt={list.title} />
                <h3>{list.title}</h3>
                <p>£{list.price}</p>
                <p>{list.category}</p>
                <div className="admin-buttons">
                  <button onClick={() => handleEditStart(list)}>Edit</button>
                  <button onClick={() => handleDelete(list)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
