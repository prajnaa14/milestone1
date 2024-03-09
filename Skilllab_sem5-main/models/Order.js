// Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
  amount: Number,
  paymentDetails: Object,
  // Other order details
});

module.exports = mongoose.model('Order', orderSchema);