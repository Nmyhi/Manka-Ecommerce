import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import './Auth.css';

const db = getFirestore();

const Account = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const [details, setDetails] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDetails(docSnap.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), details);
      alert('Details saved!');
    } catch (err) {
      alert('Error saving details: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleProfileUpload = async (e) => {
    e.preventDefault();
    if (!profileImage || !user) return alert("Select an image first");

    const storage = getStorage();
    const fileRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(fileRef, profileImage);

    const photoURL = await getDownloadURL(fileRef);
    await updateProfile(auth.currentUser, { photoURL });
    alert("Avatar is successfully uploaded!");

    window.location.reload(); // ⬅ refresh to reflect new avatar
  };

  if (user) {
    return (
      <div className="auth-container">
        <h2>Welcome, {user.displayName || user.email}</h2>
        {user.photoURL && <img src={user.photoURL} alt="Profile" className="navbar-avatar" />}
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Log Out</button>

        <div style={{ marginTop: '1rem' }}>
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
          <button onClick={handleProfileUpload}>Upload Profile Photo</button>
        </div>

        <form onSubmit={handleDetailsSubmit} className="user-details-form">
          <h3>Shipping Information</h3>
          <input type="text" name="fullName" placeholder="Full Name" value={details.fullName} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={details.phone} onChange={handleChange} />
          <input type="text" name="address1" placeholder="Address Line 1" value={details.address1} onChange={handleChange} required />
          <input type="text" name="address2" placeholder="Address Line 2" value={details.address2} onChange={handleChange} />
          <input type="text" name="city" placeholder="City" value={details.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State / Province" value={details.state} onChange={handleChange} />
          <input type="text" name="postalCode" placeholder="Postal / Zip Code" value={details.postalCode} onChange={handleChange} required />
          <input type="text" name="country" placeholder="Country" value={details.country} onChange={handleChange} required />
          <button type="submit">Save Details</button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        <button type="button" onClick={handleGoogleLogin} className="google-button">
          Sign in with Google
        </button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </p>
    </div>
  );
};

export default Account;
