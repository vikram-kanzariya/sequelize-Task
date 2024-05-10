// const dbName = "demosql";
// const dbUser = "root";
// const dbPassword = "Vikram@123";

// const sequelize = new Sequelize(dbName , dbUser , dbPassword , {
//   host:"localhost",
//   dialect:"mysql",
// });

// const Connection = async() => {
//   try {
//    await sequelize.authenticate();
//     console.log("Connected SuccessFully...");
//   } catch (error) {
//     console.log("Unable to Connect: " , error);
//   }
// }
// Connection();

// const User = sequelize.define(
//   'User' , {
//     id:{
//       type:DataTypes.INTEGER,
//       autoIncrement:true,
//       primaryKey:true,
//     },

//     firstName:{
//       type:DataTypes.STRING ,
//       allowNull:false,
//     },

//     lastName:{
//       type:DataTypes.STRING,
//     },
//     age:{
//       type: DataTypes.INTEGER
//     },
   
//   },

//   {
//     tableName:"Employees",
//     // freezeTableName:true,
//   }
// );
  


// console.log(User === sequelize.models.User);
const insertRecord = async() => {
  await sequelize.sync({alter:true });
  // await sequelize.sync({ force:true });
  const user = await  User.create({ 
    firstName:"Shubham", 
    lastName:"Vaghela", 
    age:18,
  });
  console.log(user);
  console.log(user.id);
  console.log("Inserted SuccessFully");
}
const findUsers = async() => {
  const users = await User.findAll();
  console.log(users);
}

// findUsers();
// insertRecord();


// Row Query
  let [result] = await sequelize.query("Select * from Employees");

  // Find Data By PrimaryKey 
  let users = await User.findByPk(108);
  // if(users === null){
  //   console.log("User Not Found");
  // }
  // console.log(users instanceof User);










  // username:{
  //   type:DataTypes.STRING,
  //   allowNull:false,

  //   // Getters
  //   // get(){
  //   //   const rawValue = this.getDataValue('username');
  //   //   return rawValue ? rawValue.toUpperCase() : null;
  //   // }
  // },

  // password:{
  //   type:DataTypes.STRING,

  //   // Setters
  //   // set(value){
  //   //   this.setDataValue('password' , md5(value + this.username));
  //   // }
  // },