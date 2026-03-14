import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../img/login.png';

/* ── Inline SVG icons ── */
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  /* ── ALL LOGIC UNCHANGED ── */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      toast.success('Signup Successful');
      navigate('/login');
    } catch (err) {
      console.error('❌ Signup failed:', err);
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-wrapper">

      {/* ─── LEFT: Image Panel ─── */}
      <div className="auth-image">
        <img src={signupImg} alt="MYWEAR fashion visual" />
        <div className="auth-image-overlay">
          <span className="auth-brand">MyWear</span>
          <span className="auth-tagline">Your Style, Your Story</span>
        </div>
      </div>

      {/* ─── RIGHT: Form Panel ─── */}
      <div className="auth-form">
        <div className="auth-card">

          <span className="auth-eyebrow">Join Us</span>
          <h2>Create Your Account</h2>
          <p className="auth-subtitle">
            Start designing custom apparel in minutes. It's free to join.
          </p>

          <form onSubmit={handleSignup}>
            <div className="auth-fields">

              {/* Name row */}
              <div className="auth-row">
                <div className="auth-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

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
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+91 98765 43210"
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

            </div>

            <button type="submit" className="auth-btn">
              Create Account <IconArrow />
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?&nbsp;
              <Link to="/login">Sign in</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}