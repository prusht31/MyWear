const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g., yourapp@gmail.com
    pass: process.env.EMAIL_PASS  // Gmail app password
  }
});

// ✅ SIGNUP
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      isVerified: false // Important for email verification
    });

    await user.save();

    // 🔐 Generate Email Verification Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;

    // 📧 Send verification email
    await transporter.sendMail({
      from: `"DQ Clothing" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email - DQ Clothing",
      html: `
        <h3>Verify Your Email</h3>
        <p>Hello ${firstName}, please click the link below to verify your email address:</p>
        <a href="${verificationLink}">✅ Verify My Account</a>
        <p>This link expires in 15 minutes.</p>
      `
    });

    res.status(201).json({ message: "Signup successful. Check your email to verify your account." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ EMAIL VERIFICATION ROUTE
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.send("✅ Email verified successfully. You can now log in.");
  } catch (err) {
    res.status(400).send("❌ Invalid or expired link.");
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // if (!user.isVerified) {
    //   return res.status(403).json({ message: "Please verify your email first." });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ token, user: { firstName: user.firstName, email: user.email } });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const link = `http://localhost:5173/reset-password/${token}`; // Frontend link

    await transporter.sendMail({
      from: `"DQ Clothing" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <h3>Reset Password</h3>
        <p>Click below to reset your password:</p>
        <a href="${link}">Reset Password</a>
      `
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Product not found' });
  }
});


module.exports = router;
