const OpenAI = require('openai');
const Product = require('../models/Product');
const User = require('../models/User');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.getSmartRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userPreferences = user.preferences || {};

    const products = await Product.find({ category: { $in: userPreferences.categories || [] } })
      .limit(10);

    const promptText = `Given the user preferences ${JSON.stringify(userPreferences)} and the available products ${JSON.stringify(products)}, recommend the top 5 products for this user.`;

    const completion = await openai.completions.create({
      model: "text-davinci-002",
      prompt: promptText,
      max_tokens: 200
    });

    const recommendations = JSON.parse(completion.choices[0].text);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error getting recommendations', error: error.message });
  }
};

exports.getImageAnalysis = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    // Implement image analysis logic here
    res.json({ message: 'Image analysis feature coming soon' });
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing image', error: error.message });
  }
};

exports.getPriceSuggestion = async (req, res) => {
  try {
    const productDetails = req.body;
    const promptText = `Given the product details ${JSON.stringify(productDetails)}, suggest a fair market price for this item.`;

    const completion = await openai.completions.create({
      model: "text-davinci-002",
      prompt: promptText,
      max_tokens: 50
    });

    const suggestedPrice = parseFloat(completion.choices[0].text.trim());
    res.json({ suggestedPrice });
  } catch (error) {
    res.status(500).json({ message: 'Error getting price suggestion', error: error.message });
  }
};

exports.getChatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const promptText = `User: ${message}\nAssistant: `;

    const completion = await openai.completions.create({
      model: "text-davinci-002",
      prompt: promptText,
      max_tokens: 150
    });

    const response = completion.choices[0].text.trim();
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Error getting chatbot response', error: error.message });
  }
};