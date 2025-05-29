const axios = require("axios")

//check for both ethereum 
const getOrder = async(inputMint, outputMint, amount)=> {

    if((typeof(inputMint) && typeof(outputMint)) != "string") {
        return 0
    } 
    
    try {
        const response =  await axios.get("https://lite-api.jup.ag/ultra/v1/order", {
            params : {inputMint, 
            outputMint, 
            amount
            }
        })
        console.log(`responseeeeeeeeeeeeeeeeeeeeee from orderrrrrrrrrrrrrrrrrrrr`)
        console.log(response)
        return response
        
    }catch(error) {
        return error
    }
}


module.exports = {getOrder}