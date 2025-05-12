const express = require("express")
const {getQuote, performSwap, order} = require("../controllers/trade")
const tradeRouter = express.Router()

tradeRouter.route("/getQuote").post(getQuote)
tradeRouter.route("/performSwap").post(performSwap)
tradeRouter.route("/getOrder").get(order)
module.exports = tradeRouter
