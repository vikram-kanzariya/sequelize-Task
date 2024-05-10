const express = require('express');
const { User , A , B} = require('./controllers/userController');
const { Customers } = require('./controllers/customerController')
const { sequelize } = require('./models/database');
const { Op, where } = require('sequelize');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use("/public" , express.static(path.join(__dirname , '/public')));


app.set("view engine" , "ejs");
app.set("views" , './views');

app.get("/" , (req , res) => {
  res.render('home');
});

// Create User
app.post("/createuser" , async(req , res) => {
  let uname = req.body.uname;
  let password = req.body.password;
  let fname = req.body.fname;
  let lname= req.body.lname;
  let age = req.body.age;
  console.log(req.body);

  try {

    if(!fname  || !lname || !age || (age <= 1 || age > 100)){
      return res.json({
        success:false , 
        message:"Enter All Fields Properly..."
      })
    }

    if(fname.length < 4 || fname.length > 10){
      return res.json({
        success:false , 
        message:"FirstName Should between 4-10 Characters"
      });
    }
    
    await sequelize.sync({ alter:true });

    const user = await  User.create({ 
      firstName: fname , 
      lastName: lname , 
      age: age ,
      username:uname,
      password:password
    });
    // console.log(user.getDataValue('firstName'));
    return res.redirect("/getusers");
  } catch (error) {
    console.log('Some Error Occured: ' + error);
  }


});

// Get/Read Users
app.get("/getusers" , async(req , res) => {

  await sequelize.sync({ alter:true });

  let users = await User.findAll({
    order: sequelize.literal('id ASC'),
    // offset:5,
    // limit:10,
    // group:'age'
  });
  return res.render('users' , { data:users })
});

app.get("/updateuser" , async(req , res) => {
  let uid = req.query.id;

  let users = await User.findAll({
    where:{
      id:uid
    }
  });

  return res.render('update' , { data:users });
});

// UpdateUser
app.post("/updateuser" , async(req , res) => {
  let uid = req.body.id;
  let fname = req.body.fname;
  let lname= req.body.lname;
  let age = req.body.age;
  let uname = req.body.uname;
  let password = req.body.password;

  try {
    await sequelize.sync({ alter:true });

    const users = await  User.update({ 
      firstName: fname , 
      lastName:lname ,
      age:age,
      username:uname,
      password:password,
    },

    { where: { id: uid } }
  );

    return res.redirect("/getusers");
  } catch (error) {
    console.log(error);
  }

});

// Delete User
app.get("/deleteuser" , async(req , res) => {
  let uid = req.query.id;
  console.log(uid);

  let user = await User.destroy({
    where:{
      id:uid,

    }
  });

  return res.json({ 
    success:true ,
    message:"Deleted SuccessFully.."
  })
});




const insertCustomers = async() => {
  await sequelize.sync({ alter:true });
  const user = await  Customers.create({ 
    fname:"Hardevsinh", 
    lname:"Zaala", 
  });
  console.log("Inserted SuccessFully");
}
const findUsers = async() => {
  const users = await User.findAll({
    // attributes:[ 'lastName' , [sequelize.fn('COUNT' , sequelize.col('firstName')) , 'fname'] ]
    // attributes:[  [sequelize.fn('max' , sequelize.col('age')) , 'maxage'] ]
    attributes:[  [sequelize.fn('min' , sequelize.col('age')) , 'minage'] ]
  });
  console.log(users);
}
// findUsers();

const userAge = async() => {
  let maxage = await User.max('age');
  let minage = await User.min('age');
  console.log(maxage , minage);
}
// userAge();

const findandCount = async() => {
  const { count , rows } = await User.findAndCountAll({
    where:{
      firstName:{ [Op.like] : "%lpe%", }
    }
  })
  console.log(count);
  console.log(rows);
}
// findandCount();


// Getters
const newUser = async() => {
  const user = await User.build({ username:"superuser001" });
  console.log(user.username);
  console.log(user.getDataValue('username'));
}
// newUser();


// Setters
const newPass = async() => {
  const user = await User.build({
    username:"demoUser01",
    password: "vikram"
  })
  console.log(user.username);
  console.log(user.password);
  console.log(user.getDataValue('password'));
};
// newPass();

const classes = async() => {
  await sequelize.sync({ alter:true })

  // A.hasOne(B , {
  //   foreignKey:'myFoodId',
  // });
  // B.belongsTo(A);

  const Team = sequelize.define('Team');
  const Player = sequelize.define('Player');

  Team.hasMany(Player , {
    foreignKey:'clubId' ,
  });
  Player.belongsTo(Team);

};
classes();

app.listen(process.env.PORT , () => {
  console.log(`Running on Port: ${ process.env.PORT }`);
});