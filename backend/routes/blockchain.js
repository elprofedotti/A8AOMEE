const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');

router.post('/create-nft', blockchainController.createNFT);
router.get('/verify-ownership/:nftId', blockchainController.verifyOwnership);
router.post('/transfer-nft', blockchainController.transferNFT);

module.exports = router;