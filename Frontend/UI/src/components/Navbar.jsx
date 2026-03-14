import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import logo from '../img/Logo.png';
import { useAuth } from '../context/AuthContext';
import profileIcon from '../img/profile.png';
import { FiShoppingBag, FiX, FiMenu } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Scroll shadow — NO body overflow manipulation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(prev => !prev);

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const links = [
    { to: '/',          label: 'Home'       },
    { to: '/product',   label: 'Collection' },
    { to: '/customize', label: '3D Custom'  },
    { to: '/about',     label: 'About'      },
    { to: '/contact',   label: 'Contact'    },
  ];

  return (
    <>
      <nav className={`navbar luxury-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">

          {/* LOGO */}
          <Link to="/" className="nav-logo" onClick={closeMenu}>
            <img src={logo} alt="MYWEAR logo" />
            <span className="brand-name">MYWEAR</span>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="nav-links-desktop">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={isActive(to) ? 'active' : ''}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="nav-actions">
            <Link to="/cart" className="cart-icon" aria-label="Cart">
              <FiShoppingBag size={18} />
            </Link>
            {user ? (
              <Link to="/profile" className="luxury-profile" aria-label="Profile">
                <img src={profileIcon} alt="Profile" />
              </Link>
            ) : (
              <Link to="/login" className="login-link">Login</Link>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className={`menu-toggle${isOpen ? ' open' : ''}`}
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </nav>

      {/* MOBILE DRAWER — rendered OUTSIDE nav, as sibling */}
      <div className={`mobile-drawer${isOpen ? ' open' : ''}`}>
        <ul>
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={closeMenu}
                className={isActive(to) ? 'active' : ''}
              >
                <span className="drawer-arrow">›</span>
                {label}
              </Link>
            </li>
          ))}

          {/* Cart + Login/Profile at bottom */}
          <li className="drawer-actions">
            <Link to="/cart" className="drawer-cart" onClick={closeMenu}>
              <FiShoppingBag size={16} />
              Cart
            </Link>
            {user ? (
              <Link to="/profile" className="drawer-profile" onClick={closeMenu}>
                <img src={profileIcon} alt="Profile" />
                Profile
              </Link>
            ) : (
              <Link to="/login" className="drawer-login" onClick={closeMenu}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>

      {/* OVERLAY — tap outside to close */}
      {isOpen && (
        <div className="drawer-overlay" onClick={closeMenu} />
      )}
    </>
  );
}