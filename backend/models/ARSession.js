const mongoose = require('mongoose');

const arSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  duration: { type: Number, required: true },
  interactions: [{ type: String }],
  deviceInfo: {
    type: { type: String },
    model: { type: String },
    os: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('ARSession', arSessionSchema);