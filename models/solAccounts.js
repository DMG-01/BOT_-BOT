const sequelize = require("../connectDb")
const {DataTypes} =  require("sequelize")


const solAccounts = sequelize.define("solanaAccount", {
    address : {
        type : DataTypes.TEXT
    }, 
    privateKey : {
        type : DataTypes.TEXT
    }
})

module.exports = solAccounts