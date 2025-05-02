 require("dotenv").config()
const bs58 = require("bs58")
const {Keypair, Connection} = require("@solana/web3.js")
const { API_URLS } = require('@raydium-io/raydium-sdk-v2');
const axios = require("axios")
const owner = Keypair.fromSecretKey(
    bs58.decode(process.env.PRIVATE_KEY)
)

const connection = new Connection(process.env.ALCHEMY_URL)

async function raydiumGetSwapQuote(inputMint, outputMint, amount, slippage = 0.5, txVersion = 'V0') {
    try {
      const swapUrl = `${API_URLS.SWAP_HOST}/compute/swap-base-in` +
        `?inputMint=${inputMint}` +
        `&outputMint=${outputMint}` +
        `&amount=${amount}` +
        `&slippageBps=${slippage * 100}` +
        `&txVersion=${txVersion}`;
  
      const { data: swapResponse } = await axios.get(swapUrl);
      return swapResponse;
    } catch (error) {
      console.error('Error fetching swap quote:', error.message);
      return null;
    }
  }
  

  module.exports = {raydiumGetSwapQuote}


