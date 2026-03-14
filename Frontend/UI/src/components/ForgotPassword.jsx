import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgot}>
          <input
            className='ForgetInput'
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className='ForgetInput' type="submit">Send Reset Link</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}
