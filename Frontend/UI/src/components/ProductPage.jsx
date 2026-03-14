import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductPage.css';
import { useNavigate } from 'react-router-dom';

/* Arrow icon */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.5"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

/* Empty bag icon */
const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const CATEGORIES = ['All', 'Dino', 'Logo'];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filter,   setFilter]   = useState('All');
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div className="product-page">

      {/* ─── HERO HEADER ─── */}
      <header className="product-hero">
        <span className="product-eyebrow">MYWEAR Studio</span>
        <h1 className="product-heading">Explore Our Collection</h1>
        <p className="product-subheading">
          Each piece is precision 3D printed — designed to wear your identity.
        </p>
        {!loading && (
          <span className="product-count">
            Showing <strong>{filteredProducts.length}</strong> of {products.length} pieces
          </span>
        )}
      </header>

      {/* ─── CATEGORY TABS ─── */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`tab-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'All' ? 'All Pieces' : `${cat} Series`}
          </button>
        ))}
      </div>

      {/* ─── PRODUCT GRID ─── */}
      <div className="product-grid">

        {loading && (
          /* skeleton shimmer placeholders */
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="product-card" style={{ pointerEvents: 'none' }}>
              <div className="product-img-wrap"
                   style={{ background: 'linear-gradient(90deg,#f0eeff 25%,#e8e0ff 50%,#f0eeff 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmerSweep 1.4s ease infinite' }} />
              <div className="product-body">
                <div style={{ height: 18, borderRadius: 6, background: '#f0eeff', marginBottom: 10 }} />
                <div style={{ height: 14, borderRadius: 6, background: '#f5f3ff', width: '60%' }} />
              </div>
            </div>
          ))
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">
            <EmptyIcon />
            <h3>No pieces found</h3>
            <p>Try switching to a different category.</p>
          </div>
        )}

        {!loading && filteredProducts.map((product) => (
          <div
            key={product._id}
            className="product-card"
            onClick={() => navigate(`/product/${product._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(`/product/${product._id}`)}
            aria-label={`View ${product.title}`}
          >
            {/* image */}
            <div className="product-img-wrap">
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.title}
                className="product-img"
                loading="lazy"
              />

              {/* category badge */}
              {product.category && (
                <span className={`product-badge ${product.category.toLowerCase()}`}>
                  {product.category}
                </span>
              )}

              {/* quick-view pill */}
              {/* <span className="product-quick">View Details</span> */}
            </div>

            {/* info */}
            <div className="product-body">
              <h3>{product.title}</h3>

              <div className="product-meta">
                <p className="price">₹{product.price}</p>
                <p className="brand">{product.brand}</p>
              </div>

              <div className="card-cta">
                Shop now <ArrowRight />
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}