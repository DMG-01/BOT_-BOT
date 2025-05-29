const express = require("express")
const {getQuote, performSwap, order, executeOrder} = require("../controllers/trade")
const tradeRouter = express.Router()

tradeRouter.route("/getQuote").post(getQuote)
tradeRouter.route("/performSwap").post(performSwap)
tradeRouter.route("/getOrder").get(order)
tradeRouter.route("/execute").post(executeOrder)
module.exports = tradeRouter
