const express = require("express")
const {getQuote} = require("../controllers/trade")
const tradeRouter = express.Router()

tradeRouter.route("/getQuote").post(getQuote)

module.exports = tradeRouter
