const { Keypair, Connection } = require('@solana/web3.js');
const { NATIVE_MINT } = require('@solana/spl-token');
const axios = require('axios');
const bs58 = require('bs58');
const { API_URLS } = require('@raydium-io/raydium-sdk-v2');
const { getTokenDetails } = require("./Dex/dexscreener");
const { raydiumGetSwapQuote } = require("./Dex/raydium");

(async () => {
  try {
    const quote = await raydiumGetSwapQuote(
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'JmMRbLcKgNCu17yHZDAn4strE5NjmWJ4pCeJ7s7boop', // Target token
      1 * 10 ** 9, // Amount in smallest units (1 USDC = 1e6, SOL = 1e9)
      0.5,
      'V0'
    );

    console.log('Swap Quote:', JSON.stringify(quote, null, 2));

    // Optionally fetch token info
    // const tokenInfo = await getTokenDetails("solana", "2tbHkvuJnaG1X2U4VXvKTFsvaoW2cZ2W4iM9ZmdYmoon");
    // console.log('Token Details:', tokenInfo);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
