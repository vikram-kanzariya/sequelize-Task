const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_DATABASE;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

exports.sequelize = new Sequelize(dbName , dbUser , dbPassword , {
  host:"localhost",
  host:process.env.DB_HOST,
  dialect:"mysql",
  logging:false,
  dialectOptions:undefined,
});


exports.Connection = async() => {
  try {
   await sequelize.authenticate();
    console.log("Connected SuccessFully...");
    
  } catch (error) {
    console.log("Unable to Connect: " , error);
  }
}
// Connection();