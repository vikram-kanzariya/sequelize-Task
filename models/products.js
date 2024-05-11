const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Product extends Model {};

Product.init(
  {
    title:Sequelize.toString,
  },
  {
    sequelize ,
    modelName:"product"
  }
)

class User extends Model {};

User.init(
  {
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
  },
  {
    sequelize ,
    modelName:'user'
  }
);

class Address extends Model{};

Address.init(
  {
    type: DataTypes.STRING,
    line1: Sequelize.STRING,
    line2: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    zip: Sequelize.STRING,
  },
  {
    sequelize , 
    modelName:'address'
  }
);

Product.User = Product.belongsTo(User);
User.Addresses = User.hasMany(Address);

const createModel = async() => {
  const data =  Product.create(
    {
      title:'Chair',
      user:{
        firstName:'Alpesh',
        lastName:'Prajapati',
        address:[
          {
            type:'home',
            line1:'Halvad',
            line2:'Ahmedabad',
            city:'Halvad',
            state:'Gujarat',
            zip:'363330',
          },
        ],
      },
    },
    {
      include:[
        {
          association:Product.User,
          include:[User.Addresses],
        }
      ]
    }
  );


  console.log(data);
}

createModel();