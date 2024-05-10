const { Sequelize, DataTypes, Model, QueryTypes, HasOne, HasMany } = require('sequelize');
const { sequelize } = require('../models/database');
const md5 = require("md5") ;
const bcrypt = require('bcrypt')


exports.User = sequelize.define(
  'User' , {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },

    username:{
      type:DataTypes.STRING,
      allowNull:false,
  
      // Getters
      get(){
        const rawValue = this.getDataValue('username');
        return rawValue ? rawValue.toUpperCase() : null;
      }
    },
  
    password:{
      type:DataTypes.STRING,
  
      // Setters
      set(value){
        this.setDataValue('password' , md5(value + this.username));
      }
    },

    firstName:{
      type:DataTypes.STRING ,
      allowNull:false,
      validate:{
        notEmpty:true,
        len:[4,10]
      }
      
    },

    lastName:{
      type:DataTypes.STRING,
    },
    age:{
      type: DataTypes.INTEGER
    },
   
  },

  {
    tableName:"Employees",
  }
);


exports.A = sequelize.define('A' , {
  myFoodId:{ type:DataTypes.INTEGER }
});
exports.B = sequelize.define('B');


// exports.Userone = sequelize.define('Userone' ,{
//   username:{
//     type:DataTypes.STRING,
//     allowNull:false,
//     validate:{ notEmpty:true },
//     get(){
//       const rawValue = this.getDataValue('username');
//       return rawValue ? rawValue.toUpperCase() : null
//     },
//   },
  
// });