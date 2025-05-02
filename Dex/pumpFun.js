const axios = require("axios")
require("dotenv").config()


const getTokenPrice = async(tokenAddress) => {
    try {

        const response = await axios.get(`https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`, {
            headers : {
                "X-API-Key" : process.env.MORALIS_KEY
            }
        })
        console.log(response.data)
    }catch(error) {
        console.log(error)
    }
}


module.exports =  {getTokenPrice}