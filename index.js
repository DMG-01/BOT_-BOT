const { raydiumGetSwapQuote } = require("./Dex/raydium");
const { getTokenDetails } = require("./Dex/dexscreener");
const {getTokenPrice} = require("./Dex/pumpFun")
function run() {
  const inputMint = 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump'; // USDC
  const outputMint = 'JmMRbLcKgNCu17yHZDAn4strE5NjmWJ4pCeJ7s7boop'; // Custom token
  const amount = 1 * 10 ** 9; // 1 USDC in lamports
  const slippage = 0.5;
  const version = 'V0';

  raydiumGetSwapQuote(inputMint, outputMint, amount, slippage, version)
    .then((quote) => {
      console.log('--- Swap Quote ---');
      console.log(quote);
    })
    .catch((err) => {
      console.log('Error getting quote:', err.message);
    });

 
}

getTokenPrice("H2NsueznuMFt4ehPsiAvBwrLddSYXvuBZmeYCX6hpump")
//run();
