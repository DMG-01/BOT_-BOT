const axios = require("axios")

const getTokenDetails = async(chainId, tokenAddress)=> {

      try {
             const response = await axios.get(`https://api.dexscreener.com/tokens/v1/${chainId}/${tokenAddress}`)
             console.log(`data is ----------------------: `)
             console.log(response.data)
             return (response.data)
      }catch(error) {
        console.log(error)
      }
}


module.exports = {getTokenDetails}

