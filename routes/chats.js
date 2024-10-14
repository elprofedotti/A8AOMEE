const express = require('express');
const Chat = require('../models/Chat');
const { isAuthenticated } = require('../middleware/auth');
const { createNotification } = require('../utils/notificationService');

const router = express.Router();

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { recipientId, productId } = req.body;
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, recipientId] },
      product: productId
    });
    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, recipientId],
        product: productId
      });
      await chat.save();
      await createNotification(recipientId, 'chat', 'You have a new message', chat._id);
    }
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: 'Error creating chat', error: error.message });
  }
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name profilePicture')
      .populate('product', 'name price images')
      .sort('-updatedAt');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

router.get('/:chatId', isAuthenticated, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name profilePicture')
      .populate('product', 'name price images');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'You are not authorized to view this chat' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat', error: error.message });
  }
});

router.post('/:chatId/messages', isAuthenticated, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to send messages in this chat' });
    }
    const message = {
      sender: req.user._id,
      content: req.body.content
    };
    chat.messages.push(message);
    chat.lastMessage = new Date();
    await chat.save();
    const recipientId = chat.participants.find(p => p.toString() !== req.user._id.toString());
    await createNotification(recipientId, 'message', 'You have a new message', chat._id);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: 'Error sending message', error: error.message });
  }
});

router.post('/:chatId/offer', isAuthenticated, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to make an offer in this chat' });
    }
    chat.offer = {
      amount: req.body.amount,
      status: 'pending'
    };
    await chat.save();
    const recipientId = chat.participants.find(p => p.toString() !== req.user._id.toString());
    await createNotification(recipientId, 'offer', 'You have received a new offer', chat._id);
    res.status(201).json(chat.offer);
  } catch (error) {
    res.status(400).json({ message: 'Error making offer', error: error.message });
  }
});

router.put('/:chatId/offer', isAuthenticated, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    if (!chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to respond to this offer' });
    }
    if (!chat.offer) {
      return res.status(400).json({ message: 'No offer exists for this chat' });
    }
    chat.offer.status = req.body.status;
    await chat.save();
    const recipientId = chat.participants.find(p => p.toString() !== req.user._id.toString());
    await createNotification(recipientId, 'offer_response', `The offer has been ${req.body.status}`, chat._id);
    res.json(chat.offer);
  } catch (error) {
    res.status(400).json({ message: 'Error responding to offer', error: error.message });
  }
});

module.exports = router;