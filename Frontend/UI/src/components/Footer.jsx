import React, { useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

/* Inline SVG social icons — no extra dep needed */
const IconInsta = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
  </svg>
);

const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconPinterest = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail]   = useState('');
  const [sent,  setSent]    = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(''); }
  };

  return (
    <footer className="footer luxury-footer">

      {/* Rainbow top border */}
      <div className="footer-rainbow-border" />

      {/* ─── MAIN GRID ─── */}
      <div className="footer-inner">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>MYWEAR</h2>
          <p>
            Bespoke 3D printed T-shirts crafted for modern taste —
            where precision meets personal expression.
          </p>

          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-pill">
              <IconInsta /> Instagram
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="social-pill">
              <IconX /> Twitter
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="social-pill">
              <IconPinterest /> Pinterest
            </a>
          </div>
        </div>

        {/* EXPLORE LINKS */}
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Collection</Link></li>
            <li><Link to="/customize">3D Custom</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* INFO LINKS */}
        <div className="footer-info">
          <h4>Information</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/shipping">Shipping & Returns</Link></li>
          </ul>
        </div>

      </div>

      {/* ─── NEWSLETTER ─── */}
      <div className="footer-newsletter">
        <div className="newsletter-card">
          <div>
            <h3>Stay in the loop</h3>
            <p>New drops, exclusive prints & behind-the-scenes — straight to your inbox.</p>
          </div>

          {sent ? (
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>
              ✦ &nbsp;You're on the list. Talk soon.
            </p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </div>

      {/* ─── DIVIDER ─── */}
      <div className="footer-divider" />

      {/* ─── BOTTOM BAR ─── */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MYWEAR. All rights reserved.</p>

        <nav className="footer-bottom-links" aria-label="Legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/shipping">Shipping</Link>
        </nav>

        <p className="footer-made">
          Made with <span>♥</span> & precision printing
        </p>
      </div>

    </footer>
  );
}