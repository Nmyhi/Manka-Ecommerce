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
import './Auth.css';


const Account = () => {
  const { user, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // shipping/profile fields
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
  const unsubscribe = onAuthStateChanged(auth, setUser);
  return () => unsubscribe();
}, [setUser]);


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

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    alert('Details saved (implement Firestore storage here)');
    // future: store in Firestore at `users/{uid}/profile`
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

  await auth.currentUser.reload();
  const refreshedUser = auth.currentUser;
  setUser({ ...refreshedUser });

  alert('Profile photo updated!');
};

  if (user) {
    return (
  <div className="auth-container">
    <h2>Welcome, {user.displayName || user.email}</h2>
    {user.photoURL && <img src={user.photoURL} alt="Profile" className="navbar-avatar" />}
    <p>Email: {user.email}</p>
    <button onClick={handleLogout}>Log Out</button>

    {/* Profile photo upload (separate form) */}
    <div style={{ marginTop: '1rem' }}>
      <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />
      <button onClick={handleProfileUpload}>Upload Profile Photo</button>
    </div>

    {/* Shipping details form */}
    <form onSubmit={handleDetailsSubmit} className="user-details-form">
      <h3>Shipping Information</h3>
      <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} />
      <input type="text" name="address1" placeholder="Address Line 1" onChange={handleChange} required />
      <input type="text" name="address2" placeholder="Address Line 2" onChange={handleChange} />
      <input type="text" name="city" placeholder="City" onChange={handleChange} required />
      <input type="text" name="state" placeholder="State / Province" onChange={handleChange} />
      <input type="text" name="postalCode" placeholder="Postal / Zip Code" onChange={handleChange} required />
      <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
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
