const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');
const { createNotification } = require('../utils/notificationService');

const router = express.Router();

router.post('/create-payment-intent', isAuthenticated, async (req, res) => {<boltAction type="file" filePath="routes/payments.js">
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.status !== 'available') {
      return res.status(400).json({ message: 'Product is not available for purchase' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: { productId: product._id.toString(), buyerId: req.user._id.toString() }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
});

router.post('/confirm-payment', isAuthenticated, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not been succeeded' });
    }
    const { productId, buyerId } = paymentIntent.metadata;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const transaction = new Transaction({
      buyer: buyerId,
      seller: product.seller,
      product: productId,
      amount: paymentIntent.amount / 100,
      status: 'completed',
      paymentMethod: 'stripe',
      paymentId: paymentIntentId
    });
    await transaction.save();
    product.status = 'sold';
    await product.save();
    await createNotification(product.seller, 'sale', 'Your product has been sold', product._id);
    res.json({ message: 'Payment confirmed and transaction recorded' });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error: error.message });
  }
});

router.get('/transactions', isAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }]
    })
      .populate('product', 'name images')
      .populate('buyer', 'name profilePicture')
      .populate('seller', 'name profilePicture')
      .sort('-createdAt');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

module.exports = router;