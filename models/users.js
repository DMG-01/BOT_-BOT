const sequelize = require("../connectDb")
const {DataTypes} = require("sequelize")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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
    }
})
user.beforeCreate(async (userInstance) => {
    const salt = await bcrypt.genSalt(10);
    userInstance.password = await bcrypt.hash(userInstance.password, salt);
  });
  
user.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
user.prototype.createJWT = function () {
    return jwt.sign(
      { userId: this.id, userName: this.userName },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
  };

  



module.exports = user