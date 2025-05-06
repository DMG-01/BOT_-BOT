const user = require("./users")
const statusCodes = require("http-status-codes")
const {getTokenDetails} = require("../Dex/dexscreener")
const {raydiumGetSwapQuote} = require("../Dex/raydium")
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
                quote :_quote
            })
        }else {
            console.log(`not raydium`)
        }


    }catch(error) {

    }
}

module.exports =  {getQuote}