const { Keypair } = require('@solana/web3.js');
const ethWeb3 = require('web3');
const statusCodes = require('http-status-codes');
const crypto = require("crypto")
require("dotenv").config()

const signUp = async (req, res) => {
    
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


const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.CRYPTO_SECRET_KEY, "hex"); // Must be 32 bytes
const iv = Buffer.from(process.env.CRYPTO_SECRET_IV, "hex"); // Must be 16 bytes


const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};


const decrypt = (hash) => {
    const [ivHex, encryptedData] = hash.split(":");
    const ivBuffer = Buffer.from(ivHex, "hex");

    if (ivBuffer.length !== 16) throw new Error("Invalid IV length"); // Ensuring IV length is correct

    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, "hex")), decipher.final()]);
    return decrypted.toString();
};

module.exports = { signUp };
