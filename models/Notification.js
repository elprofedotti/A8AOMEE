const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, refPath: 'itemModel' },
  itemModel: { type: String, enum: ['Product', 'Chat', 'User'] },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);