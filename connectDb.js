const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.GUARD_DB_NAME,
  process.env.GUARD_DB_USER,
  process.env.GUARD_DB_PASS,
  {
    host: process.env.GUARD_DB_HOST,
    port: process.env.GUARD_DB_PORT,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 100000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
