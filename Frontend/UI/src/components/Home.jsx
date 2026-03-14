// import React, { useEffect, useState, useRef } from 'react';
// import './Home.css';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Card from './Card.jsx';

// export default function Home() {
//   const [products, setProducts]           = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('Dino');
//   const heroRef = useRef(null);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/products')
//       .then(res => setProducts(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   /* Subtle mouse parallax on hero image */
//   useEffect(() => {
//     const hero = heroRef.current;
//     if (!hero) return;

//     const handleMove = (e) => {
//       const { innerWidth, innerHeight } = window;
//       const x = (e.clientX / innerWidth  - 0.5) * 10;
//       const y = (e.clientY / innerHeight - 0.5) * 10;
//       hero.style.transform = `translate(${x}px, ${y}px)`;
//     };

//     window.addEventListener('mousemove', handleMove);
//     return () => window.removeEventListener('mousemove', handleMove);
//   }, []);

//   const featured = products.slice(0, 3);
//   const filtered = products.filter(p => p.category === selectedCategory);

//   return (
//     <div className="home luxury">

//       {/* ─── HERO ─── */}
//       <section className="hero">
//         <div className="hero-text">
//           <span className="eyebrow">Bespoke 3D Apparel</span>
//           <h1>
//             <span className="line-1">Design</span><br />
//             <span className="line-2">Crafted</span><br />
//             <span className="line-3">Identity</span>
//           </h1>
//           <p>
//             Precision 3D printed T-shirts designed to reflect
//             individuality, restraint, and modern luxury.
//           </p>

//           <div className="hero-actions">
//             <Link to="/customize" className="btn-primary">Design Your T-Shirt</Link>
//             <Link to="/product"   className="btn-secondary">View Collection</Link>
//           </div>
//         </div>

//         <div className="hero-visual" ref={heroRef}>
//           <img
//             src="https://static.vecteezy.com/system/resources/thumbnails/004/680/048/small_2x/illustration-wolf-roaring-on-the-moon-with-t-shirt-design-free-vector.jpg"
//             alt="Luxury T Shirt"
//           />
//         </div>
//       </section>

//       {/* ─── BRAND STORY ─── */}
//       <section className="section story">
//         <h2>Why MYWEAR</h2>
//         <p>
//           We merge advanced 3D printing technology with timeless
//           fashion principles — creating garments that feel personal,
//           intentional, and enduring.
//         </p>
//       </section>

//       {/* ─── FEATURED ─── */}
//       <section className="section">
//         <div className="section-header">
//           <h2>Featured Pieces</h2>
//           <p>Quiet statements with lasting impact</p>
//         </div>

//         <div className="products-grid ">
//           {featured.map(p =>
//             p._id && (
//               <div key={p._id} className="product-card luxury-card flex column center">
//                 <img src={`http://localhost:5000/${p.image}`} alt={p.title} />
//                 <h3>{p.title}</h3>
//                 <span>₹{p.price}</span>
//                 <Link to={`/product/${p._id}`} className="text-link">
//                   View Details
//                 </Link>
//               </div>
//             )
//           )}
//         </div>
//       </section>

//       {/* ─── PROCESS ─── */}
//       <section className="section muted process">
//         <div className="process-step">
//           <h4>01</h4>
//           <p>Design in 3D</p>
//         </div>
//         <div className="process-step">
//           <h4>02</h4>
//           <p>Precision Printing</p>
//         </div>
//         <div className="process-step">
//           <h4>03</h4>
//           <p>Crafted  Delivered</p>
//         </div>
//       </section>

//       {/* ─── COLLECTION ─── */}
//       <section className="section">
//         <div className="section-header center">
//           <h2>New Collection</h2>
//           <p>Designed for understated confidence</p>
//         </div>

//         <div className="category-switch">
//           <button
//             className={selectedCategory === 'Dino' ? 'active' : ''}
//             onClick={() => setSelectedCategory('Dino')}
//           >
//             Dino Series
//           </button>
//           <button
//             className={selectedCategory === 'Logo' ? 'active' : ''}
//             onClick={() => setSelectedCategory('Logo')}
//           >
//             Logo Series
//           </button>
//         </div>

//         <div className="products-grid">
//           {filtered.map(p =>
//             p._id && (
//               <Card
//                 key={p._id}
//                 id={p._id}
//                 title={p.title}
//                 brand={p.brand}
//                 price={`₹${p.price}`}
//                 stock={p.stock ? 'In Stock' : 'Out of Stock'}
//                 img={`http://localhost:5000/${p.image}`}
//               />
//             )
//           )}
//         </div>
//       </section>

//       {/* ─── CTA ─── */}
//       <section className="cta">
//         <h2>Create Something That Is Yours</h2>
//         <p>3D precision. Tailored expression.</p>
//         <Link to="/customize" className="btn-primary light">
//           Begin Custom Design
//         </Link>
//       </section>

//     </div>
//   );
// }
import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from './Card.jsx';

export default function Home() {
  const [products, setProducts]                 = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Dino');
  const heroImgRef = useRef(null);
  const isMobile   = useRef(window.innerWidth <= 768);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  /* Mouse parallax — desktop only, on the image only */
  useEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;

    const handleResize = () => { isMobile.current = window.innerWidth <= 768; };
    window.addEventListener('resize', handleResize);

    const handleMove = (e) => {
      if (isMobile.current) return;          // skip on mobile
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth  - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      img.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const featured = products.slice(0, 3);
  const filtered  = products.filter(p => p.category === selectedCategory);

  return (
    <div className="home luxury">

      {/* ─── HERO ─── */}
      <section className="hero">

        <div className="hero-text">
          <span className="eyebrow">Bespoke 3D Apparel</span>
          <h1>
            <span className="line-1">Design</span><br />
            <span className="line-2">Crafted</span><br />
            <span className="line-3">Identity</span>
          </h1>
          <p>
            Precision 3D printed T-shirts designed to reflect
            individuality, restraint, and modern luxury.
          </p>
          <div className="hero-actions">
            <Link to="/customize" className="btn-primary">Design Your T-Shirt</Link>
            <Link to="/product"   className="btn-secondary">View Collection</Link>
          </div>
        </div>

        {/* Parallax applied to img, not wrapper — wrapper stays in grid */}
        <div className="hero-visual">
          <img
            ref={heroImgRef}
            src="https://static.vecteezy.com/system/resources/thumbnails/004/680/048/small_2x/illustration-wolf-roaring-on-the-moon-with-t-shirt-design-free-vector.jpg"
            alt="Luxury T-Shirt"
          />
        </div>

      </section>

      {/* ─── BRAND STORY ─── */}
      <section className="section story">
        <h2>Why MYWEAR</h2>
        <p>
          We merge advanced 3D printing technology with timeless
          fashion principles — creating garments that feel personal,
          intentional, and enduring.
        </p>
      </section>

      {/* ─── FEATURED ─── */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Pieces</h2>
          <p>Quiet statements with lasting impact</p>
        </div>

        <div className="products-grid">
          {featured.map(p =>
            p._id && (
              <div key={p._id} className="product-card luxury-card">
                <img src={`http://localhost:5000/${p.image}`} alt={p.title} />
                <h3>{p.title}</h3>
                <span>₹{p.price}</span>
                <Link to={`/product/${p._id}`} className="text-link">
                  View Details →
                </Link>
              </div>
            )
          )}
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="process">
        <div className="process-step">
          <h4>01</h4>
          <p>Design in 3D</p>
        </div>
        <div className="process-step">
          <h4>02</h4>
          <p>Precision Printing</p>
        </div>
        <div className="process-step">
          <h4>03</h4>
          <p>Crafted &amp; Delivered</p>
        </div>
      </section>

      {/* ─── COLLECTION ─── */}
      <section className="section">
        <div className="section-header center">
          <h2>New Collection</h2>
          <p>Designed for understated confidence</p>
        </div>

        <div className="category-switch">
          {['Dino', 'Logo'].map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat} Series
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filtered.map(p =>
            p._id && (
              <Card
                key={p._id}
                id={p._id}
                title={p.title}
                brand={p.brand}
                price={`₹${p.price}`}
                stock={p.stock ? 'In Stock' : 'Out of Stock'}
                img={`http://localhost:5000/${p.image}`}
              />
            )
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta">
        <h2>Create Something That Is Yours</h2>
        <p>3D precision. Tailored expression.</p>
        <Link to="/customize" className="btn-primary light">
          Begin Custom Design
        </Link>
      </section>

    </div>
  );
}