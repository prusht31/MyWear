import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Profile from './components/Profile';
import ProductDetails from './components/ProductDetails';
import Customizer from './components/Customizer';
import CartViewer from './components/CartViewer';
import ProductPage from './components/ProductPage';

function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem('adminToken');
  return isAdmin ? children : <Navigate to="/admin-login" />;
}

function App() {
  const location = useLocation();

  // Routes where Navbar should be hidden
  const hideNavbar = ['/admin', '/admin-login'].includes(location.pathname);

  // Routes where Footer should be hidden
  const hideFooter = ['/login', '/signup', '/admin', '/admin-login'].includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" />
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<CartViewer />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/customize" element={<Customizer />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        } />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;