const express = require("express")
const { getUserDetails} = require("../controllers/users")
const userRouter = express.Router()

userRouter.route("/").get(getUserDetails)

module.exports = userRouter