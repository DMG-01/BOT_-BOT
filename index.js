const express = require("express")
const sequelize = require("./connectDb")
const userRouter = require("./routes/userRoute")
const {} = require("./middleware/authentication")
const authRouter = require("./routes/auth")
const tradeRouter = require("./routes/trade")
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user",userRouter)
app.use("/", authRouter)
app.use("/trade", tradeRouter)

const axios = require('axios');

async function getJupiterBalance(address) {
  try {
    const url = `https://lite-api.jup.ag/ultra/v1/balances/${address}`;
    const headers = {
      //'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/json',
      'Origin': 'https://jup.ag',
      'Referer': 'https://jup.ag',
    };

    const response = await axios.get(url, { headers });
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching balance:", error.response?.data || error.message);
  }
}

//getJupiterBalance("5QKgkzyfSznWmNbcDdXaxNMhM6Nn6Zhz3igEwpXqUQM7");


const run = async()=> {

  try {

    await sequelize.authenticate()

    //await sequelize.sync({force: true }) 
const PORT = 4000
app.listen(PORT,async()=> {

  console.log(`listening on port ${PORT}`)
})
  }catch(error) {
    console.log({error})
  }
}


run()


































































/*const { raydiumGetSwapQuote } = require("./Dex/raydium");
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

//getTokenPrice("H2NsueznuMFt4ehPsiAvBwrLddSYXvuBZmeYCX6hpump")
getTokenDetails("solana","H2NsueznuMFt4ehPsiAvBwrLddSYXvuBZmeYCX6hpump" )
//run();
*/