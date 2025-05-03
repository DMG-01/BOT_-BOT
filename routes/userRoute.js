const express = require("express")
const {signUp} = require("../controllers/users")
const userRouter = express.Router()

userRouter.route("/").post(signUp)

module.exports = userRouter