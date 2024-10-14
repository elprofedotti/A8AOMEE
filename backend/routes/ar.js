const express = require('express');
const router = express.Router();
const arController = require('../controllers/arController');

router.get('/model/:productId', arController.getARModel);
router.post('/save-session', arController.saveARSession);

module.exports = router;