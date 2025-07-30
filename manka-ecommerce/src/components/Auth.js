import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Signed up!');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Logged in with Google!');
    } catch (err) {
      alert(err.message);
    }
  };

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

export default Auth;
