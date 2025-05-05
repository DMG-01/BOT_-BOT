const sequelize = require("../connectDb")
const {DataTypes} = require("sequelize")

const ethereumAccount = sequelize.define("ethereumAccount", {
    address : {
        type :DataTypes.STRING, 
        unique : true, 
        allowNull : false
    }, 
    privateKey : {
        type : DataTypes.STRING, 
        unique : true, 
        allowNull :false
    }
})

module.exports = ethereumAccount