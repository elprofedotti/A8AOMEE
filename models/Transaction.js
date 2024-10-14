const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, required: true },
  paymentId: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);