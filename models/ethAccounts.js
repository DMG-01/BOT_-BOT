const sequelize = require("../connectDb")
const {DataTypes} = require("sequelize")

const ethereumAccount = sequelize.define("ethereumAccount", {
    address : {
        type :DataTypes.TEXT
    }, 
    privateKey : {
        type : DataTypes.TEXT
    }
})

module.exports = ethereumAccount