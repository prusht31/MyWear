import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Inline SVG icons ── */
const IconEdit   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconSave   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

/* get initials from name */
const getInitials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();

export default function Profile() {
  const [user,     setUser]     = useState(null);
  const [editable, setEditable] = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [orders,   setOrders]   = useState([]);
  const navigate = useNavigate();

  /* ── fetch profile (UNCHANGED logic) ── */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/login'); return; }
      try {
        const res = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        if (res.data.email) fetchUserOrders(res.data.email);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        setError('Failed to load profile. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async (email) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/user/${email}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ── field change (UNCHANGED) ── */
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  /* ── edit toggle / save (UNCHANGED) ── */
  const handleEditToggle = async () => {
    if (editable) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.put('http://localhost:5000/api/user/update', user, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Profile updated');
      } catch (err) {
        console.error('❌ Failed to update profile', err);
        toast.error('Update failed');
      }
    }
    setEditable(!editable);
  };

  /* ── logout (UNCHANGED) ── */
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  /* ── loading ── */
  if (loading) return (
    <div className="profile-container">
      <div className="profile-loading">
        <div className="loading-spinner" />
        <p>Loading Profile…</p>
      </div>
    </div>
  );

  /* ── error ── */
  if (error) return (
    <div className="profile-container">
      <div className="profile-error">
        <p>⚠️ {error}</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="profile-container">

      {/* ─── BANNER HEADER ─── */}
      <div className="profile-header">
        <div className="profile-header-inner">
          <div className="profile-header-left">
            <div className="profile-avatar-circle">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className="profile-header-text">
              <h2>Welcome, {user.firstName} {user.lastName}</h2>
              <p>{new Date().toDateString()}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <IconLogout /> Logout
          </button>
        </div>
      </div>

      {/* ─── BODY GRID ─── */}
      <div className="profile-body">

        {/* ═══ LEFT: Profile Card ═══ */}
        <div className="profile-card">
          {/* card top */}
          <div className="profile-card-top">
            <div className="profile-card-identity">
              <div className="profile-mini-avatar">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div>
                <h3>{user.firstName} {user.lastName}</h3>
                <p>{user.email}</p>
              </div>
            </div>

            <button
              className={`btn-edit ${editable ? 'saving' : ''}`}
              onClick={handleEditToggle}
            >
              {editable ? <><IconSave /> Save</> : <><IconEdit /> Edit</>}
            </button>
          </div>

          {/* form */}
          <div className="profile-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                disabled={!editable}
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                disabled={!editable}
                placeholder="Last name"
              />
            </div>

            <div className="form-group field-locked">
              <label>Email Address</label>
              <input
                name="email"
                value={user.email}
                disabled
                placeholder="Email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                value={user.phone || ''}
                onChange={handleChange}
                disabled={!editable}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Orders ═══ */}
        <div className="orders-section">
          <div className="orders-section-header">
            <h2>My Orders</h2>
            {orders.length > 0 && (
              <span className="orders-count-badge">{orders.length}</span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">🛍️</div>
              <h3>No orders yet</h3>
              <p>Your order history will appear here once you place an order.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map(order => (
                <div
                  key={order._id}
                  className={`user-order-card status-${order.status.toLowerCase()}`}
                >
                  {/* header */}
                  <div className="user-order-header">
                    <span>
                      <strong>Ordered : </strong>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* items */}
                  <div className="user-order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="user-order-item">
                        <span>{item.quantity}× & Size {item.size}</span>
                        <span>₹{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>

                  {/* footer */}
                  <div className="user-order-footer">
                    <strong>
                      Total :
                      <span className="order-total-value">₹{order.totalAmount}</span>
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>{/* end profile-body */}

    </div>
  );
}