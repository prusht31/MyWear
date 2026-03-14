import React, { useState } from 'react';
import './ContactUs.css';

/* ── Inline SVG icons ── */
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2"
       strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const infoItems = [
  {
    icon: '✉️',
    color: 'violet',
    label: 'Email Us',
    value: 'support@dqclothing.com',
    href: 'mailto:support@dqclothing.com',
  },
  {
    icon: '📞',
    color: 'coral',
    label: 'Call Us',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: '📍',
    color: 'teal',
    label: 'Visit Us',
    value: 'MyWear Clothing HQ, Gujarat, India',
    href: 'https://maps.google.com',
  },
];

const hours = [
  { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday',        time: '10:00 AM – 4:00 PM' },
  { day: 'Sunday',          time: 'Closed' },
];

export default function ContactUs() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">

      {/* ─── HERO ─── */}
      <header className="contact-hero">
        <span className="contact-eyebrow">We're Here to Help</span>
        <h1>Contact Us</h1>
        <p>Have questions or inquiries? We'd love to hear from you — drop us a message and we'll get back within 24 hours.</p>
      </header>

      {/* ─── CONTENT ─── */}
      <div className="contact-container">
        <div className="contact-content">

          {/* ═══ FORM CARD ═══ */}
          <div className="contact-form-card">
            <h2>Send a Message</h2>
            <p>Fill in the details below and our team will respond promptly.</p>

            {sent ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out — we'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Tell us how we can help…"
                    required
                  />
                </div>

                <button type="submit" className="btn-send">
                  <IconSend /> Send Message
                </button>

              </form>
            )}
          </div>

          {/* ═══ INFO SIDEBAR ═══ */}
          <div className="contact-info-card">

            {/* dark heading card */}
            <div className="info-heading-card">
              <h3>Get in Touch</h3>
              <p>Our support team is standing by, ready to help you with anything.</p>
            </div>

            {/* contact items */}
            {infoItems.map(({ icon, color, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="info-item"
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <div className={`info-icon ${color}`}>{icon}</div>
                <div className="info-text">
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              </a>
            ))}

            {/* support hours */}
            <div className="hours-card">
              <h4>Support Hours</h4>
              {hours.map(({ day, time }) => (
                <div className="hours-row" key={day}>
                  <span>{day}</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}