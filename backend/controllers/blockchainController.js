const Web3 = require('web3');
const NFTContract = require('../contracts/NFTContract.json');
const NFT = require('../models/NFT');

const web3 = new Web3(process.env.ETHEREUM_NODE_URL);
const nftContract = new web3.eth.Contract(NFTContract.abi, process.env.NFT_CONTRACT_ADDRESS);

exports.createNFT = async (req, res) => {
  try {
    const { productId } = req.body;
    const account = web3.eth.accounts.privateKeyToAccount(process.env.ETHEREUM_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);

    const result = await nftContract.methods.createNFT(productId).send({ from: account.address });
    const tokenId = result.events.Transfer.returnValues.tokenId;

    const nft = new NFT({
      tokenId,
      productId,
      owner: account.address,
    });
    await nft.save();

    res.json({ tokenId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating NFT', error: error.message });
  }
};

exports.verifyOwnership = async (req, res) => {
  try {
    const { nftId } = req.params;
    const owner = await nftContract.methods.ownerOf(nftId).call();
    res.json({ isOwner: owner.toLowerCase() === req.user.ethereumAddress.toLowerCase() });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying ownership', error: error.message });
  }
};

exports.transferNFT = async (req, res) => {
  try {
    const { nftId, toAddress } = req.body;
    const account = web3.eth.accounts.privateKeyToAccount(process.env.ETHEREUM_PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);

    await nftContract.methods.transferFrom(account.address, toAddress, nftId).send({ from: account.address });

    const nft = await NFT.findOne({ tokenId: nftId });
    if (nft) {
      nft.owner = toAddress;
      nft.transactionHistory.push({
        from: account.address,
        to: toAddress,
        date: new Date(),
        price: 0 // Actualizar con el precio real si está disponible
      });
      await nft.save();
    }

    res.json({ message: 'NFT transferred successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error transferring NFT', error: error.message });
  }
};