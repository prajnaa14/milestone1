const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Order = require('./models/Order'); // Import the Order model

const app = express();
const PORT = process.env.PORT || 3001; // Change port to 3001 or any other available port

// Middleware
app.use(express.json());

// MongoDB connection setup
mongoose.connect('mongodb://0.0.0.0:27017/skilllabsem5', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define cron job to cancel orders
cron.schedule('*/20 * * * *', async () => {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    // Find orders that are pending and created more than 20 minutes ago
    const orders = await Order.updateMany(
      { status: 'pending', createdAt: { $lt: twentyMinutesAgo } },
      { $set: { status: 'canceled' } }
    );

    console.log('Canceled orders:', orders.nModified);
  } catch (error) {
    console.error('Error cancelling orders:', error);
  }
});

// Routes
app.use('/api/orders', require('./routes/orderRoutes')); // Example route for orders

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
