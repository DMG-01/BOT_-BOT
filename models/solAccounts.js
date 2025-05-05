const sequelize = require("../connectDb")
const {DataTypes} =  require("sequelize")


const solAccounts = sequelize.define("solanaAccount", {
    address : {
        type : DataTypes.STRING,
        allowNull : false, 
        unique : true
    }, 
    privateKey : {
        type : DataTypes.STRING,
        allowNull: false, 
        unique : true
    }
})

module.exports = solAccounts