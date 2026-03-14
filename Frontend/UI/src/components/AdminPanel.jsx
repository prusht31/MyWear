import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './AdminPanel.css';

/* ── Inline SVG icons ── */
const IconLogout  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconBox     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconOrders  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>;
const IconEdit    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>;
const IconPlus    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconSave    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconCheck   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconUpload  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;

export default function AdminPanel() {
  const [products,   setProducts]   = useState([]);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState({
    title: '', brand: '', description: '', price: '', category: 'Dino', stock: ''
  });
  const [imageFile,  setImageFile]  = useState(null);
  const [modelFile,  setModelFile]  = useState(null);
  const [orders,     setOrders]     = useState([]);
  const [view,       setView]       = useState('products');

  /* ── image / model file name display ── */
  const [imageName, setImageName] = useState('');
  const [modelName, setModelName] = useState('');

  /* ── ALL DATA LOGIC UNCHANGED ── */
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/products');
      setProducts(res.data);
    } catch (err) { console.error('❌ Failed to fetch products', err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/order/all');
      setOrders(res.data);
    } catch (err) { console.error('❌ Failed to fetch orders', err); }
  };

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/order/update/${id}`, { status });
      toast.success(`Order ${status}`);
      fetchOrders();
    } catch (err) { console.error(err); toast.error('Failed to update status'); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
    setImageName(e.target.files[0]?.name || '');
  };

  const handleModelUpload = (e) => {
    setModelFile(e.target.files[0]);
    setModelName(e.target.files[0]?.name || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in form) data.append(key, form[key]);
    if (imageFile) data.append('image', imageFile);
    if (modelFile) data.append('model3D', modelFile);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/products/${editingId}`, data);
        toast.success('Product updated');
      } else {
        await axios.post('http://localhost:5000/api/admin/add-product', data);
        toast.success('Product added');
      }
      setForm({ title: '', brand: '', description: '', price: '', category: 'Dino', stock: '' });
      setImageFile(null); setModelFile(null);
      setImageName('');   setModelName('');
      setEditingId(null);
      fetchProducts();
    } catch (err) { console.error(err); toast.error('Error submitting form'); }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setView('products');
    setForm({
      title: product.title, brand: product.brand,
      description: product.description, price: product.price,
      category: product.category, stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) { console.error(err); toast.error('Failed to delete product'); }
    }
  };

 return (
  <div className="admin-container">

    {/* ─── HEADER ─── */}
    <div className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-main-title">Admin Dashboard</h1>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
       <IconLogout></IconLogout> Logout
      </button>
    </div>

    {/* ─── NAV TABS ─── */}
    <div className="admin-nav">
      <button
        className={`nav-btn ${view === 'products' ? 'active' : ''}`}
        onClick={() => setView('products')}
      >
        <IconBox /> Manage Products
      </button>
      <button
        className={`nav-btn ${view === 'orders' ? 'active' : ''}`}
        onClick={() => setView('orders')}
      >
        <IconOrders /> Manage Orders
        {orders.filter(o => o.status === 'Pending').length > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 20, height: 20, borderRadius: 999,
            background: 'var(--c1)', color: '#fff',
            fontSize: '.68rem', fontWeight: 700, padding: '0 .45rem',
          }}>
            {orders.filter(o => o.status === 'Pending').length}
          </span>
        )}
      </button>
    </div>

    {/* rest of your JSX unchanged */}

      {/* ─── BODY ─── */}
      <div className="admin-body">

        {view === 'products' ? (
          <>
            {/* ═══ PRODUCT FORM ═══ */}
            <div className="admin-form-card">
              <div className="admin-form-card-inner">
                <h3>{editingId ? '✏️ Edit Product' : '＋ Add New Product'}</h3>

                <form className="admin-form" onSubmit={handleSubmit} encType="multipart/form-data">

                  <div className="form-group">
                    <label>Title</label>
                    <input name="title" placeholder="Product title" value={form.title} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Brand</label>
                    <input name="brand" placeholder="Brand name" value={form.brand} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input name="price" type="number" placeholder="0" value={form.price} onChange={handleChange} required />
                  </div>

                  <div className="form-group">
                    <label>Stock</label>
                    <input name="stock" type="number" placeholder="0" value={form.stock} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      <option value="Dino">Dino</option>
                      <option value="Logo">Logo</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea name="description" placeholder="Product description…" value={form.description} onChange={handleChange} />
                  </div>

                  {/* file uploads */}
                  <div className="form-group full-width">
                    <label>Product Image</label>
                    <label className="file-upload-label">
                      <span className="file-upload-icon">🖼️</span>
                      <span>{imageName || 'Click to upload image (JPG, PNG, WebP)'}</span>
                      <input type="file" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>

                  <div className="form-group full-width">
                    <label>3D Model</label>
                    <label className="file-upload-label">
                      <span className="file-upload-icon">📦</span>
                      <span>{modelName || 'Click to upload 3D model (.glb)'}</span>
                      <input type="file" onChange={handleModelUpload} accept=".glb" />
                    </label>
                  </div>

                  <div className="full-width" style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn-submit">
                      {editingId ? <><IconSave /> Update Product</> : <><IconPlus /> Add Product</>}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setForm({ title: '', brand: '', description: '', price: '', category: 'Dino', stock: '' });
                          setImageName(''); setModelName('');
                        }}
                        style={{
                          padding: '.85rem 1.6rem', borderRadius: 999, border: '1.5px solid var(--border)',
                          background: 'rgba(255,255,255,.05)', color: 'var(--muted)',
                          fontFamily: 'var(--font-body)', fontSize: '.88rem', fontWeight: 600,
                          cursor: 'pointer', transition: 'all .2s',
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>

            {/* ═══ PRODUCT LIST ═══ */}
            <div>
              <h2 className="product-list-heading">
                Product List
                <span style={{
                  fontSize: '.8rem', fontFamily: 'var(--font-body)', fontWeight: 600,
                  color: 'var(--muted)', letterSpacing: '.06em',
                }}>
                  ({products.length} items)
                </span>
              </h2>

              {products.length === 0 ? (
                <div className="admin-empty">
                  <span className="admin-empty-icon">📦</span>
                  No products yet. Add your first one above.
                </div>
              ) : (
                <div className="product-list">
                  {products.map(product => (
                    <div className="product-card" key={product._id}>
                      <img src={`http://localhost:5000/${product.image}`} alt={product.title} />
                      <div className="product-info">
                        <h3>{product.title}</h3>
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Stock:</strong> {product.stock} units</p>
                        <p className="product-price">₹{product.price}</p>
                      </div>
                      <div className="product-actions">
                        <button className="btn-edit-product" onClick={() => handleEdit(product)}>
                          <IconEdit /> Edit
                        </button>
                        <button className="btn-delete-product" onClick={() => handleDelete(product._id)}>
                          <IconTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (

          /* ═══ ORDERS VIEW ═══ */
          <div className="orders-section">
            <h2>Customer Orders</h2>

            {orders.length === 0 ? (
              <div className="admin-empty">
                <span className="admin-empty-icon">🛒</span>
                No orders yet.
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div
                    key={order._id}
                    className={`order-card status-${order.status.toLowerCase()}`}
                  >
                    {/* order header */}
                    <div className="order-header">
                      <h3>Order · {order._id.slice(-8).toUpperCase()}</h3>
                      <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                      <p><strong>Customer:</strong> {order.email}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}</p>
                    </div>

                    {/* items */}
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-detail">
                          <span>{item.quantity}× & Size {item.size}</span>
                          <span>₹{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>

                    {/* footer */}
                    <div className="order-footer">
                      <p className="total-amount">
                        Total: <strong>₹{order.totalAmount}</strong>
                      </p>
                      {order.status === 'Pending' && (
                        <div className="order-actions">
                          <button className="approve-btn" onClick={() => handleUpdateOrderStatus(order._id, 'Approved')}>
                            <IconCheck /> Approve
                          </button>
                          <button className="reject-btn" onClick={() => handleUpdateOrderStatus(order._id, 'Rejected')}>
                            <IconX /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>{/* end admin-body */}
    </div>
  );
}