const { Keypair } = require('@solana/web3.js');
const ethWeb3 = require('web3');
const statusCodes = require('http-status-codes');
const crypto = require("crypto")
require("dotenv").config()
const bs58 = require("bs58")
const {encrypt, decrypt} = require("../utils/encryption") 
const {user,ethAccounts, solAccounts } = require("../models/association")



const getUserDetails = async(req,res)=> {
     try {
        if(!req.body) {
            return res.status(statusCodes.BAD_REQUEST).json({
                isSuccess : false, 
                msg:`req.body not found`
            })
        }
        const {userName} = req.body

        if(!userName) {
            return res.status(statusCodes.BAD_REQUEST).json({
                isSuccess : false, 
                msg:`missing required parameter`
            })
        }

        
        const userDetails = await user.findOne({
            where : {
                userName 
               
            } , 
            include : [{
                model :ethAccounts, 
                as : "ethAccount", 
                attributes : ["address"]

            }, {
                model : solAccounts, 
                as : "solAccount", 
                attributes : ["address"]
            }
        ], attributes : ["userName", "id", "emailAddress"]
        })

        if(!userDetails) {
            return res.status(statusCodes.NOT_FOUND).json({
                isSuccess : true, 
                msg : `No account under the userName ${userName}`
            })
        }


        return res.status(statusCodes.OK).json({
            isSuccess : true, 
            user : userDetails
        })

    

     }catch(error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess : false, 
            error
        })
     }
}


const importWallet = async(req, res)=> {
    try {

        const _user = await user.findOne({
            where : {
                id : req.user.userId, 
                userName : req.user.userName
            }
        })
        if(!req.body) {
            return res.status(statusCodes.BAD_REQUEST).json({
                isSuccess : false, 
                msg:`MISSING REQ.BODY`
            })
        }

        const {chainId, privateKey, mnemonicPhrase} = req.body

        if((!chainId && !privateKey) || (!chainId && !mnemonicPhrase)) {
            return res.status(statusCodes.BAD_REQUEST).json({isSuccess : false, msg:`missing required parameter`})
        }
            console.log(`privateKyyyy : ${privateKey}`)
        if(chainId === "ethereum" && privateKey) {

            const isAccount = await ethAccounts.findOne({
                where : {
                    privateKey : await encrypt(privateKey), 
                    userId : req.user.userId
                }
            })
            console.log({isAccount})

    

           const newAccount =  ethWeb3.eth.accounts.privateKeyToAccount(`0x${privateKey}`)
           if(!newAccount) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({isSuccess : false, msg:`INVALID PRIVATE KEY`})
           } 

           constNewEthAccount = await ethAccounts.create({
                address : newAccount.address, 
                privateKey : encrypt(newAccount.privateKey), 
                userId : req.user.userId
           })

           return res.status(statusCodes.OK).json({isSuccess : true, msg:`account with address ${newAccount.address} has been successfully imported`})
        
    }  

    if(chainId==="solana" && privateKey) {

        try {

            const decode = bs58.decode(privateKey)
            const newSolAccount =  Keypair.fromSecretKey(decode) 
           
               await solAccounts.create({
                address : newSolAccount.publicKey.toBase58(), 
                privateKey : encrypt(privateKey),
                userId : req.user.userId
               })


                return res.status(statusCodes.OK).json({isSuccess : true, msg :`${newSolAccount.publicKey.toBase58()} imported successfully`})
        }catch(error) {
            console.log(error)
            return res.status(statusCodes.OK).json({
                isSuccess : false, 
                msg : `INTERNAL_SERVER_ERROR`
            })
        }
    }
    

    }catch(error) {
        console.log(error)
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            isSuccess : false,
            msg : `INTERNAL_SERVER_ERROR`
        })
    }
}



module.exports = {getUserDetails, importWallet };
