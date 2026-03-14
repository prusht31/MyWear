import React, { useEffect, useState } from 'react';
import './CartViewer.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import QRCode from 'qrcode';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/* ── Inline SVG icons ── */
const IconCart     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>;
const IconShield   = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconLock     = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconTruck    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconCheck    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconArrow    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;

export default function CartViewer() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showQR,    setShowQR]    = useState(false);
  const [qrImage,   setQrImage]   = useState('');

  /* ── totals (UNCHANGED logic) ── */
  const subtotal   = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
  const tax        = +(subtotal * 0.1).toFixed(2);
  const grandTotal = (subtotal + tax).toFixed(2);

  /* ── fetch cart (UNCHANGED) ── */
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/user/${user.email}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchCart();
  }, [user]);

  /* ── QR generation (UNCHANGED) ── */
  useEffect(() => {
    if (showQR) {
      const qrValue = `upi://pay?pa=dhrumilkorat81@oksbi&pn=KD's Fashion&am=${grandTotal}&cu=INR&tn=Payment for order by ${user.email}`;
      QRCode.toDataURL(qrValue, {
        color: { dark: '#0f0f0f', light: '#ffffff' },
        margin: 2,
        width: 240,
      })
        .then(url => setQrImage(url))
        .catch(err => console.error('QR generation failed:', err));
    }
  }, [showQR, grandTotal, user]);

  /* ── qty change (UNCHANGED) ── */
  const handleQtyChange = async (id, newQty) => {
    if (newQty < 1) return;
    await axios.put(`http://localhost:5000/api/cart/update/${id}`, { quantity: newQty });
    fetchCart();
  };

  /* ── delete (UNCHANGED) ── */
  const handleDelete = async (id) => {
    if (window.confirm('Remove this item?')) {
      await axios.delete(`http://localhost:5000/api/cart/delete/${id}`);
      fetchCart();
    }
  };

  /* ── checkout (UNCHANGED) ── */
  const handleCheckout = async () => {
    try {
      const orderData = {
        email: user.email,
        items: cartItems.map(item => ({
          productId:  item.productId,
          size:       item.size,
          quantity:   item.quantity,
          price:      item.image ? item.price : item.totalPrice,
          totalPrice: (item.image ? item.price : item.totalPrice) * item.quantity,
          snapshots:  item.snapshots,
          image:      item.image,
        })),
        totalAmount: grandTotal,
      };
      const res = await axios.post('http://localhost:5000/api/order/create', orderData);
      toast.success('Order placed successfully!');
      setCartItems([]);
      setShowQR(false);
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order');
    }
  };

  /* ── loading state ── */
  if (loading) return (
    <div className="cart-main" style={{ marginTop: '80px' }}>
      <div className="cart-loading">Loading your cart…</div>
    </div>
  );

  return (
    <div className="cart-main" style={{ marginTop: '80px' }}>
      <div className="cart-wrapper">

        {/* ─── HERO HEADER ─── */}
        <div className="cart-hero">
          <span className="cart-eyebrow">Your Selection</span>
          <h2 className="cart-title">Your Cart</h2>
          <p className="cart-subtitle">
            <span className="cart-item-count">{cartItems.length}</span>
            {cartItems.length === 1 ? ' item' : ' items'} in your bag
          </p>
        </div>

        {/* ─── EMPTY STATE ─── */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/product" className="btn-shop">
              Browse Collection <IconArrow />
            </Link>
          </div>
        ) : (
          <>
            {/* ─── LAYOUT ─── */}
            <div className="cart-layout">

              {/* ═══ ITEMS TABLE ═══ */}
              <div>
                <div className="cart-table">
                  <div className="cart-table-header">
                    <span>Item</span>
                    <span>Details</span>
                    <span>Quantity</span>
                    <span>Total</span>
                    <span></span>
                  </div>

                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      className="cart-row"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <img
                        className="thumb"
                        src={item.snapshots?.front || `http://localhost:5000/${item.image}`}
                        alt="product"
                      />

                      <div className="cart-details">
                        <h3>Size: {item.size}</h3>
                        <p>₹{item.image ? item.price : item.totalPrice} / piece</p>
                      </div>

                      <div className="qty-controls">
                        <button
                          onClick={() => handleQtyChange(item._id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      <div className="cart-total">
                        ₹{((item.image ? item.price : item.totalPrice) * item.quantity).toFixed(2)}
                      </div>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(item._id)}
                        aria-label="Remove item"
                      >
                        <FaTrashAlt />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ═══ SUMMARY CARD ═══ */}
              <div className="cart-summary">
                <div className="summary-header">
                  <h3>Order Summary</h3>
                </div>

                <div className="summary-body">
                  <div className="line">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="line">
                    <span>Sales Tax (10%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="line">
                    <span>Shipping</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>Free</span>
                  </div>
                  <div className="line divider total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <div className="summary-footer">
                  <button className="checkout-btn" onClick={() => setShowQR(true)}>
                    <IconCart /> Proceed to Checkout
                  </button>
                </div>

                <div className="trust-badges">
                  <div className="trust-badge"><IconShield /> Secure</div>
                  <div className="trust-badge"><IconLock /> Encrypted</div>
                  <div className="trust-badge"><IconTruck /> Free Ship</div>
                </div>
              </div>

            </div>{/* end cart-layout */}

            {/* ─── QR PAYMENT PANEL ─── */}
            {showQR && (
              <div className="qr-payment">
                <div className="qr-card">
                  <span className="qr-card-eyebrow">UPI Payment</span>
                  <h3>Scan to Pay</h3>

                  <div className="qr-img-wrap">
                    {qrImage ? (
                      <img src={qrImage} alt="UPI QR Code" />
                    ) : (
                      <div className="qr-generating">Generating…</div>
                    )}
                  </div>

                  <div className="qr-amount">
                    <span>Amount Due</span>
                    <strong>₹{grandTotal}</strong>
                  </div>

                  <button className="confirm-payment-btn" onClick={handleCheckout}>
                    <IconCheck /> I've Paid — Place Order
                  </button>

                  <p className="qr-disclaimer">
                    * This is a demo QR. No real payment gateway is connected. Do not send real money.
                  </p>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}