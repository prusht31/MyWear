const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Debug incoming requests
app.use((req, res, next) => {
  next();
});

// MongoDB local connection
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("✅ MongoDB connected locally"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Load your routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);


const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/order', orderRoutes);

app.use('/api/user', require('./routes/user'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
