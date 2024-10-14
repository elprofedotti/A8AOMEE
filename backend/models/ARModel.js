const mongoose = require('mongoose');

const arModelSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  modelUrl: { type: String, required: true },
  format: { type: String, required: true },
  scale: { type: Number, default: 1 },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  rotation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('ARModel', arModelSchema);