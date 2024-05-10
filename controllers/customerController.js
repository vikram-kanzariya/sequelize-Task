const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../models/database');


exports.Customers = sequelize.define('Customers' , {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true , 
    autoIncrement:true
  },
  fname:{
    type:DataTypes.STRING,
    allowNull:false
  },
  lname:{
    type:DataTypes.STRING
  }
} ,

{
  tableName:"Customers",
} 
);