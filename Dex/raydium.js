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


  const raydiumPerformSwap = async ({
    publicKey,
    wrapSol = false,
    unwrapSol = false,
    inputAccount,
    outputAccount,
    swapResponse,
    computeUnitPriceMicroLamports,
    txVersion = 'V0'
  }) => {
    try {
      const swapUrl = `${API_URLS.SWAP_HOST}/transaction/swap-base-in`;
  
      const response = await axios.post(swapUrl, {
        wallet: publicKey,
        wrapSol,
        unwrapSol,
        inputAccount : "So11111111111111111111111111111111111111112",
        swapResponse,
        computeUnitPriceMicroLamports: String(computeUnitPriceMicroLamports),
        txVersion
      });
  
      console.log("Swap response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Swap error:", error.response?.data || error.message);
    }
  };
  

  module.exports = {raydiumGetSwapQuote,raydiumPerformSwap}


