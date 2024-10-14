const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/recommendations/:userId', aiController.getSmartRecommendations);
router.post('/image-analysis', aiController.getImageAnalysis);
router.post('/price-suggestion', aiController.getPriceSuggestion);
router.post('/chatbot', aiController.getChatbotResponse);

module.exports = router;