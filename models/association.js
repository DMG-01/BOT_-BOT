
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "mysql",
  }
);


const user = require("./users")
const solAccounts = require("./solAccounts")
const ethAccounts = require("./ethAccounts")


user.hasMany(solAccounts, {
    foreignKey : "userId", 
    as : "solAccount"
})

solAccounts.belongsTo(user, {
    foreignKey : "userId", 
    as : "user"
})

user.hasMany(ethAccounts, {
  foreignKey : "userId", 
  as : "ethAccount"
})

ethAccounts.belongsTo(user, {
    foreignKey : "userId", 
    as :"user"
})




module.exports = {user, ethAccounts, solAccounts}

