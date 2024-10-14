const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post('/', isAuthenticated, upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = await Promise.all(
      req.files.map(file => cloudinary.uploader.upload(file.path).then(result => result.secure_url))
    );
    const product = new Product({
      ...req.body,
      images: imageUrls,
      seller: req.user._id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, sort, limit = 20, page = 1 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const sortOption = sort === 'price_asc' ? { price: 1 } : 
                       sort === 'price_desc' ? { price: -1 } : 
                       { createdAt: -1 };
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('seller', 'name profilePicture');
    const total = await Product.countDocuments(query);
    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name profilePicture sellerRating');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.views += 1;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this product' });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }
    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.likes.includes(req.user._id)) {
      product.likes.pull(req.user._id);
    } else {
      product.likes.push(req.user._id);
    }
    await product.save();
    res.json({ likes: product.likes.length });
  } catch (error) {
    res.status(400).json({ message: 'Error liking/unliking product', error: error.message });
  }
});

module.exports = router;