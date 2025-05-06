const axios = require("axios")

const getTokenDetails = async(chainId, tokenAddress)=> {

      try {
             const response = await axios.get(`https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddress}`)
             return (response.data)
      }catch(error) {
        console.log(error)
      }
}


module.exports = {getTokenDetails}

