const sequelize = require("../connectDb")
const {DataTypes} = require("sequelize")

const user = sequelize.define("users", {
    userName : {
        type : DataTypes.STRING, 
        allowNulL : false
    }, 
    emailAddress : {
        type :DataTypes.STRING, 
        allowNull : false
    }, 
    password  : {
        type : DataTypes.TEXT, 
        allowNull : false
    }, 
    evmAddress : {
        type : DataTypes.TEXT, 
    }, 
    ethereumPrivateKey : {
        type : DataTypes.TEXT
    }, 
    solanaAddress : {
        type : DataTypes.TEXT
    }, 
    solanaPrivateKey : {
        type : DataTypes.TEXT
    }
})


module.exports = user