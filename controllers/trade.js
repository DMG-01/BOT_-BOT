const user = require("./users.js")
const statusCodes = require("http-status-codes")
const {getTokenDetails} = require("../Dex/dexscreener.js")
const {raydiumGetSwapQuote, raydiumPerformSwap} = require("../Dex/raydium.js")
const {getOrder} = require("../Dex/jupiter.js")
const axios = require("axios")

const getQuote = async(req,res)=> {
    try {

        if(!req.body) {
            return res.status(statusCodes.BAD_REQUEST).json({isSuccess : false, msg:`MISSING REQ.BODY`})
        }

        const {tokenAddress, chainId, inputTokenAddress, amountToSwap, slippage} = req.body
        if(!tokenAddress || !inputTokenAddress || !amountToSwap ||!slippage) {
            return res.status(statusCodes.BAD_REQUEST).json({
                isSuccess : false, 
                msg:`MISSING TOKEN ADDRESS PARAMETER`
            })
        }
        let exchange, price, marketCap,name

        if(!chainId) {
            console.log(`no chain id`)
            let data = await getTokenDetails("solana", tokenAddress)
            if(data.length < 1) {
                    data = await getTokenDetails("ethereum", tokenAddress)
                    if(data.length < 1) {
                        return res.status(statusCodes.NOT_FOUND).json({isSuccess : false, msg : `UNSUPPORTED CHAIN`})
                    }
                    console.log(`chain id is ethereum`)
                    exchange = data[0].dexId
                    price = data[0].priceUsd
                    marketCap = data[0].marketCap
                    name = data[0].baseToken.name
                    symbol = data[0].baseToken.symbol


                    console.log({exchange, price, marketCap,name, symbol  })
            }
            
                   exchange = data[0].dexId
                    price = data[0].priceUsd
                    marketCap = data[0].marketCap
                    name = data[0].baseToken.name
                    symbol = data[0].baseToken.symbol

                    console.log({exchange, price, marketCap,name, symbol  })
        } else if(chainId) {

        const tokenData = await getTokenDetails(chainId, tokenAddress)
        console.log(`tokenDataaaaaaa : `)
        console.log(tokenData)
            if(tokenData.length <1) {
                return res.status(statusCodes.BAD_REQUEST).json({isSuccess : false, msg : `INVALID TOKEN ADDRESS OR CHAIN ID`})
            }

            exchange = tokenData[0].dexId
            price = tokenData[0].priceUsd
            marketCap = tokenData[0].marketCap
            name = tokenData[0].baseToken.name
            symbol = tokenData[0].baseToken.symbol

            console.log({exchange, price, marketCap,name, symbol  })
        console.log(exchange)
        }
        
        if(exchange === "raydium") {
            console.log(`getting quoteeeeeeeeeeeee`)
            const quote = await raydiumGetSwapQuote(inputTokenAddress, tokenAddress, amountToSwap,0.5,"V0")
            console.log(quote)

            const _quote = {
                inputToken : quote.data.inputMint,
                outputToken : name, 
                inputAmount : quote.data.inputAmount, 
                outputAmount : quote.data.outputAmount, 
                percentageImpact : quote.data.priceImpactPct
            }

            return res.status(statusCodes.OK).json({
                isSuccess : true, 
                quote :_quote, 
                mainQuote :quote
            })
        }else {
            console.log(`not raydium`)
        }


    }catch(error) {

    }
}


const performSwap = async(req,res)=> {
if(!req.body) {
    return res.status(statusCodes.BAD_REQUEST).json({isSuccess : false, msg:`missing req.body`})
}

const {wrapSol, unwrapSol, inputAccount, outputAccount, computeUnitPriceMicroLamports, amount} = req.body

    try {
        console.log(`getting quote.....`)
        const swapResponse = await raydiumGetSwapQuote("So11111111111111111111111111111111111111112", "JmMRbLcKgNCu17yHZDAn4strE5NjmWJ4pCeJ7s7boop",10000000,0.5, "v0" )
        console.log({raydiummmmmmm_quoteeeeeeee: swapResponse})
        const data = await raydiumPerformSwap("5QKgkzyfSznWmNbcDdXaxNMhM6Nn6Zhz3igEwpXqUQM7",wrapSol, unwrapSol, swapResponse, computeUnitPriceMicroLamports, "v0"   )

    }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({isSuccess : false, error })
    }
}


const order = async (req, res) => {
    try {
      if (!req.body) {
        return res.status(statusCodes.BAD_REQUEST).json({ isSuccess: false, msg: `missing req.body` });
      }
      const { inputMint, outputMint, amount } = req.body;
      if (!inputMint || !outputMint || !amount) {
        return res.status(statusCodes.BAD_REQUEST).json({ isSuccess: false, msg: `missing required parameter` });
      }
  
      const response = await getOrder(inputMint, outputMint, amount);
      
      if (response.status !== 200) {
        
        let errorMessage = 'Failed to get order from Jupiter API.';
        let invalidOutputMint;
  
        if (response.status === 400 && response.data && response.data.error === 'Invalid outputMint') {
          errorMessage = 'Invalid outputMint provided.';
          invalidOutputMint = outputMint; 
        } else if (response.data && response.data.error) {
          errorMessage = response.data.error; 
        }
  
        return res.status(statusCodes.BAD_REQUEST).json({
          isSuccess: false,
          response: {
            message: errorMessage,
            invalidOutputMint: invalidOutputMint,
            jupiterResponse: response.data, 
            status: response.status,
          },
        });
      }
  
      if (response.status === 200) {
        return res.status(statusCodes.OK).json({ isSuccess: true, data: response.data/*, fullData : response*/}); // Send response.data
      }
    } catch (error) {
      console.error("Error in order controller:", error);
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ isSuccess: false, msg: `INTERNAL_SERVER_ERROR` });
    }
  };
  

  const executeOrder = async(req,res)=> {
    
    try {
            if(!req.body) {
                return res.status(statusCodes.BAD_GATEWAY).json({
                    isSuccess : false, 
                    msg :`missing req.body`
                })
            }

            const {inputMint, outputMint, amount} = req.body
            if(!inputMint || !outputMint || !amount) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    isSuccess: false, 
                    msg : `missing required parameter`
                })
            }

            const response = await getOrder(inputMint, outputMint, amount)
            console.log(response.transaction)
            if(!response.data.requestId) {
                console.log(`msg: error in line 179`)
                return 0
            }

            const requestId = response.data.requestId
            console.log(requestId)
            
            /*const executeOrder = await axios.post("https://lite-api.jup.ag/ultra/v1/execute", {
                signedTransaction :  
                requestId    
            })
            */
    }catch(error) {
        console.log(error)
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess : false,
            msg : `an internal error occured`, 
            error : error
        })
    }
  }



module.exports =  {getQuote, performSwap, order, executeOrder}