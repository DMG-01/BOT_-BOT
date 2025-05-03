const { Keypair } = require('@solana/web3.js');
const ethWeb3 = require('web3');
const statusCodes = require('http-status-codes');

const signUp = async (req, res) => {
    console.log("................")
  try {
    const { userName, emailAddress } = req.body;

    if (!userName || !emailAddress) {
      return res.status(statusCodes.BAD_REQUEST).json({
        isSuccess: false,
        msg: 'Missing required parameters',
      });
    }

    // Ethereum Wallet
    const eth = ethWeb3.eth.accounts.create();
    const ethAddress = eth.address;
    const ethPrivateKey = eth.privateKey;

    // Solana Wallet
    const sol = Keypair.generate();
    const solPublicKey = sol.publicKey.toBase58();
    const solPrivateKey = Buffer.from(sol.secretKey).toString('base64');

    return res.status(statusCodes.OK).json({
      isSuccess: true,
      msg: 'Wallets generated successfully',
      eth: {
        address: ethAddress,
        privateKey: ethPrivateKey,
      },
      solana: {
        publicKey: solPublicKey,
        privateKey: solPrivateKey,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      isSuccess: false,
      msg: 'INTERNAL_ERROR_OCCURRED',
    });
  }
};

module.exports = { signUp };
