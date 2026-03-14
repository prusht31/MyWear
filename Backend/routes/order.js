const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const CartItem = require('../models/CartItem');

// Create a new order
router.post('/create', async (req, res) => {
    try {
        const { email, items, totalAmount } = req.body;

        // Create the order
        const newOrder = new Order({
            email,
            items,
            totalAmount
        });

        await newOrder.save();

        // Clear the user's cart after successful order
        await CartItem.deleteMany({ email: email });

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        console.error("❌ Order creation failed:", err);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

// Get orders for a specific user
router.get('/user/:email', async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user orders' });
    }
});

// Get all orders (Admin only - for now simple route)
router.get('/all', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch all orders' });
    }
});

// Update order status (Admin)
router.put('/update/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update order status' });
    }
});

module.exports = router;
