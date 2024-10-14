const ARModel = require('../models/ARModel');
const ARSession = require('../models/ARSession');

exports.getARModel = async (req, res) => {
  try {
    const productId = req.params.productId;
    const arModel = await ARModel.findOne({ productId });
    if (!arModel) {
      return res.status(404).json({ message: 'AR model not found' });
    }
    res.json(arModel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AR model', error: error.message });
  }
};

exports.saveARSession = async (req, res) => {
  try {
    const sessionData = req.body;
    const arSession = new ARSession(sessionData);
    await arSession.save();
    res.status(201).json({ message: 'AR session saved successfully', sessionId: arSession._id });
  } catch (error) {
    res.status(500).json({ message: 'Error saving AR session', error: error.message });
  }
};