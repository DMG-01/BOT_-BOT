const { Keypair } = require('@solana/web3.js');
const ethWeb3 = require('web3');
const statusCodes = require('http-status-codes');
const crypto = require("crypto")
require("dotenv").config()
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



module.exports = {getUserDetails };
