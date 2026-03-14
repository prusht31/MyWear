import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../img/login.png';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

/* ── Inline SVG icons ── */
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  /* ── ALL LOGIC UNCHANGED ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser({ ...res.data.user, token: res.data.token });
      toast.success('Login Successful');
      navigate('/');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-wrapper">

      {/* ─── LEFT: Image Panel ─── */}
      <div className="auth-image">
        <img src={loginImg} alt="MYWEAR fashion visual" />
        <div className="auth-image-overlay">
          <span className="auth-brand">MyWear</span>
          <span className="auth-tagline">Wear What You Are</span>
        </div>
      </div>

      {/* ─── RIGHT: Form Panel ─── */}
      <div className="auth-form">
        <div className="auth-card">

          <span className="auth-eyebrow">Welcome Back</span>
          <h2>Login to Your Account</h2>
          <p className="auth-subtitle">
            Sign in to manage your orders, customizations and profile.
          </p>

          <form onSubmit={handleLogin}>
            <div className="auth-fields">

              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

            </div>

            <button type="submit" className="auth-btn">
              Sign In <IconArrow />
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?&nbsp;
              <Link to="/signup">Create one</Link>
            </p>
            <Link to="/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}