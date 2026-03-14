import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import img from '../img/about.png';

const perks = [
  { icon: '🎨', color: 'violet', text: 'Trend-driven, always-fresh designs'      },
  { icon: '🌿', color: 'teal',   text: 'Premium, eco-friendly fabric'             },
  { icon: '✏️', color: 'coral',  text: 'Customization for personal & business use' },
  { icon: '🚀', color: 'amber',  text: 'Fast and reliable delivery, every time'   },
];

const values = [
  {
    emoji: '🖨️',
    title: 'Precision Craft',
    desc:  'Every piece is produced with state-of-the-art 3D printing technology, ensuring razor-sharp graphics and colour accuracy that lasts wash after wash.',
  },
  {
    emoji: '🌱',
    title: 'Sustainable Core',
    desc:  'We source only GOTS-certified organic cotton and water-based inks — because great style should never cost the planet.',
  },
  {
    emoji: '🧩',
    title: 'Yours, Entirely',
    desc:  'From personal statement pieces to branded merchandise, our studio-grade customizer lets you design down to the last pixel.',
  },
];

const stats = [
  { number: '10K+',  label: 'Happy Customers'  },
  { number: '500+',  label: 'Unique Designs'   },
  { number: '100%',  label: 'Eco-Friendly'     },
  { number: '2-Day', label: 'Avg. Dispatch'    },
];

export default function AboutUs() {
  return (
    <div className="about-page">

      {/* ─── HERO ─── */}
      <header className="about-hero">
        <span className="about-eyebrow">Our Story</span>
        <h1>About MyWear Clothing</h1>
        <p className="about-tagline">Wear Your Style. Customize Your Vibe.</p>
      </header>

      {/* ─── STATS BAR ─── */}
      <div className="about-stats">
        {stats.map(({ number, label }) => (
          <div className="stat-item" key={label}>
            <div className="stat-number">{number}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="about-container">
        <div className="about-grid">

          {/* TEXT */}
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              MyWear Clothing is more than just a brand — it's a lifestyle. Born with the
              idea of self-expression, we specialise in premium quality T-shirts that
              combine bold designs with customisable creativity. Whether it's streetwear,
              minimalism, or graphic tees — we design what defines you.
            </p>

            <h2>What We Do</h2>
            <p>
              We offer customisable and ready-to-wear T-shirts that reflect attitude,
              art, and authenticity. All our products are crafted using high-grade fabrics,
              vibrant printing, and sustainable materials to ensure both comfort and style.
            </p>

            <h2>Why Choose Us?</h2>
            <ul>
              {perks.map(({ icon, color, text }) => (
                <li key={text}>
                  <span className={`perk-icon ${color}`}>{icon}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* IMAGE */}
          <div className="about-image">
            <img src={img} 
            alt="About MyWear Clothing" />

            {/* floating badge */}
            <div className="about-image-badge">
              <div className="badge-icon">✦</div>
              <div className="badge-text">
                <strong>Est. 2022</strong>
                <span>Surat, India</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── VALUES SECTION ─── */}
      <div className="about-values">
        <div className="values-header">
          <h2>What We Stand For</h2>
          <p>Three pillars that shape every thread we produce</p>
        </div>

        <div className="values-grid">
          {values.map(({ emoji, title, desc }) => (
            <div className="value-card" key={title}>
              <span className="value-emoji">{emoji}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA STRIP ─── */}
      <div className="about-cta">
        <div className="about-cta-inner">
          <h2>Ready to Wear Your Identity?</h2>
          <p>3D precision. Tailored expression.</p>
          <Link to="/customize" className="btn-primary">
            Start Designing
          </Link>
        </div>
      </div>

    </div>
  );
}