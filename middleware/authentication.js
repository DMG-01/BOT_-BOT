const { Keypair } = require('@solana/web3.js');
const ethWeb3 = require('web3');
const statusCodes = require('http-status-codes');
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {user,ethAccounts, solAccounts } = require("../models/association")



const algorithm = "aes-256-ctr";
const secretKey = Buffer.from(process.env.CRYPTO_SECRET_KEY, "hex"); // Must be 32 bytes
const iv = Buffer.from(process.env.CRYPTO_SECRET_IV, "hex"); // Must be 16 bytes


const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};


const decrypt = (hash) => {
    const [ivHex, encryptedData] = hash.split(":");
    const ivBuffer = Buffer.from(ivHex, "hex");

    if (ivBuffer.length !== 16) throw new Error("Invalid IV length"); // Ensuring IV length is correct

    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, "hex")), decipher.final()]);
    return decrypted.toString();
};


const signUp = async (req, res) => {
    
  try {
    const { userName, emailAddress, password } = req.body;

    if (!userName || !emailAddress || !password) {
      return res.status(statusCodes.BAD_REQUEST).json({
        isSuccess: false,
        msg: 'Missing required parameters',
      });
    }

   
    const eth = ethWeb3.eth.accounts.create();
    const ethAddress = eth.address;
    const ethPrivateKey = encrypt(eth.privateKey);

  
    const sol = Keypair.generate();
    const solPublicKey = sol.publicKey.toBase58();
    const solPrivateKey =  encrypt(Buffer.from(sol.secretKey).toString('base64'));

    const newUser = await user.create({
        userName,
        emailAddress, 
        password
    })

     await ethAccounts.create({
            address : ethAddress, 
            privateKey : ethPrivateKey, 
            userId : newUser.id
    })

    await solAccounts.create({
            address : solPublicKey, 
            privateKey : solPrivateKey, 
            userId : newUser.id
    })
    
    return res.status(statusCodes.OK).json({
      isSuccess: true,
      msg: 'Wallets generated successfully',
      eth: {
        address: ethAddress,
        privateKey: ethPrivateKey,
      },
      solana: {
        publicKey: solPublicKey,
        privateKey: solPrivateKey,
      },
      newUser
    });
  } catch (error) {
    console.error(error);
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      isSuccess: false,
      msg: 'INTERNAL_ERROR_OCCURRED',
    });
  }
};

const login =  async(req,res) => {
   
  try {

    if(!req.body) {
      return res.status(statusCodes.BAD_REQUEST).json({
        isSuccess : false, 
        msg:`missing req.body`
      })
    }

    const {userName, password} = req.body
         if(!userName || !password) {
          return res.status(statusCodes.BAD_REQUEST).json({
            isSuccess : false, 
            msg:`missing required parameter`
          })
         }

         const _user = await user.findOne({
          where : {
            userName
          }
         })

         if(!_user) {
          return res.status(statusCodes.NOT_FOUND).json({
            isSuccess : false,
            msg :`no account with username ${userName} found`
          })
         }

         const isPassword = await _user.comparePassword(password)

         if(!isPassword) {
            return res.status(statusCodes.UNAUTHORIZED).json({
              isSuccess : false, 
              msg:`INCORRECT PASSWORD`
            })
         }

         const jsonToken = await _user.createJWT()

         return res.status(statusCodes.OK).json({isSuccess :true, jsonToken})
  }catch(error) {
    console.log(error)
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      isSuccess : false, 
      msg : `INTERNAL _ERROR_OCCURED`
    })
  }
}


const userAuthentication = async(req,res, next)=> {

  try {

    const token = req.headers.authorization
     if(!token) {
      return res.status(statusCodes.BAD_REQUEST).json({isSuccess: false, msg :`NO TOKEN FOUND`})
     }

     const payload = jwt.verify(token, process.env.JWT_SECRET)
     req.user = {
          userId :payload.userId, 
          userName : payload.userName
     }
     next()

  }catch(error) {
    console.log(error)
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({isSuccess : false, msg : `INTERNAL_SERVER_ERROR`})
  }
}


module.exports = {signUp, login, userAuthentication}