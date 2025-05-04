const express = require("express")
const {signUp, getUserDetails} = require("../controllers/users")
const userRouter = express.Router()

userRouter.route("/").post(signUp)
userRouter.route("/").get(getUserDetails)

module.exports = userRouter