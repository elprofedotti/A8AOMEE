const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createNotification = async (recipientId, type, content, relatedItem, itemModel) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      content,
      relatedItem,
      itemModel
    });
    await notification.save();

    // Send push notification if user has push notifications enabled
    const recipient = await User.findById(recipientId);
    if (recipient.notifications.push) {
      // Implement push notification logic here (e.g., using Firebase Cloud Messaging)
    }

    // Send email notification if user has email notifications enabled
    if (recipient.notifications.email) {
      // Implement email notification logic here
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};