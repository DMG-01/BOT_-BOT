const express = require("express")
const authRouter = express.Router()
const {signUp} = require("../middleware/authentication")

authRouter.route("/signUp").post(signUp)

module.exports = authRouter