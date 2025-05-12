const express = require("express")
const { getUserDetails, importWallet, getAccountBalance} = require("../controllers/users")
const {userAuthentication} = require("../middleware/authentication")
const userRouter = express.Router()

userRouter.route("/").get(getUserDetails)
userRouter.route("/import").post(userAuthentication,importWallet)
userRouter.route("/balance").get(getAccountBalance)

module.exports = userRouter