const { Sequelize, DataTypes, Model, QueryTypes, HasOne, HasMany } = require('sequelize');
const { sequelize } = require('../config/database');
const md5 = require("md5") ;
const bcrypt = require('bcrypt')


exports.User = sequelize.define(
  'User' , {
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
    },

    title: Sequelize.STRING,

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

    fullName:{
      type:DataTypes.VIRTUAL,
      get(){
        return `${this.firstName} ${this.lastName}`
      },
      set(value){
        throw new Error("This is New Error" , value);
      }
    },
   
  },

  {
    tableName:"Employees",
  }
);


exports.A = sequelize.define('A' , 
{
  fname:DataTypes.STRING,
  lname:DataTypes.STRING
});

exports.B = sequelize.define('B', {
  myFoodId:{ type:DataTypes.INTEGER },
  age:DataTypes.INTEGER
});


class Post extends Model {};

exports.Post = Post.init(
  {
    firstName:DataTypes.STRING,
    lastName:DataTypes.STRING,
  },
  {
    sequelize , 
    paranoid:true,
    deletedAt:'destroyTime',
  }
);


exports.Person = sequelize.define('person', { name: DataTypes.STRING }, { timestamps: false });
exports.Task = sequelize.define('task', { name: DataTypes.STRING }, { timestamps: false });
exports.Tool = sequelize.define(
  'tool',
  {
    name: DataTypes.STRING,
    size: DataTypes.STRING,
  },
  { timestamps: false },
);