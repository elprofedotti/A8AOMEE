const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  condition: { type: String, enum: ['new', 'like new', 'good', 'fair', 'poor'], required: true },
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [String]
}, { timestamps: true });

productSchema.index({ location: '2dsphere' });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);