const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  tokenId: { type: String, required: true, unique: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  owner: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  transactionHistory: [{
    from: { type: String },
    to: { type: String },
    date: { type: Date },
    price: { type: Number }
  }]
}, { timestamps: true });

module.exports = mongoose.model('NFT', nftSchema);