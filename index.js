require('dotenv').config();
const { Keypair, Connection } = require('@solana/web3.js');
const { NATIVE_MINT } = require('@solana/spl-token');
const axios = require('axios');
const bs58 = require('bs58');
const { API_URLS } = require('@raydium-io/raydium-sdk-v2');
const {getTokenDetails} = require("./Dex/dexscreener")


// Load wallet and connection
const owner = Keypair.fromSecretKey(
  bs58.decode(process.env.PRIVATE_KEY)
);
const connectionn = new Connection(process.env.ALCHEMY_URL);

// Define the swap quote function
async function getSwapQuote(inputMint, outputMint, amount, slippage = 0.5, txVersion = 'V0') {
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

// Call the function with actual values
/*
(async () => {
  const inputMint = `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` // NATIVE_MINT.toBase58(); // SOL
  const outputMint = 'JmMRbLcKgNCu17yHZDAn4strE5NjmWJ4pCeJ7s7boop'; // USDC on Solana  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
  const amount = 1 * 10 ** 9; 
  const slippage = 0.5; 
  const txVersion = 'V0'; 

  const quote = await getSwapQuote(inputMint, outputMint, amount, slippage, txVersion);

  if (quote) {
    console.log('Swap Quote:', JSON.stringify(quote, null, 2));
  } else {
    console.log('Failed to get quote');
  }
})();*/

getTokenDetails("solana", `2tbHkvuJnaG1X2U4VXvKTFsvaoW2cZ2W4iM9ZmdYmoon`)