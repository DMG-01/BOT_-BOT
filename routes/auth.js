const express = require("express")
const authRouter = express.Router()
const {signUp,login} = require("../middleware/authentication")

authRouter.route("/signUp").post(signUp)
authRouter.route("/login").post(login)

module.exports = authRouter