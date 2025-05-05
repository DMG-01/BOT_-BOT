const express = require("express")
const { getUserDetails, importWallet} = require("../controllers/users")
const {userAuthentication} = require("../middleware/authentication")
const userRouter = express.Router()

userRouter.route("/").get(getUserDetails)
userRouter.route("/import").post(userAuthentication,importWallet)

module.exports = userRouter