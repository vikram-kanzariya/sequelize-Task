const express = require('express');
const { User , A , B , Post , Person , Task , Tool } = require('./controllers/userController');
const { sequelize } = require('./models/database');
const { Op, where, DataTypes } = require('sequelize');
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

  // await sequelize.sync({ alter:true });

  let users = await User.findAll({ 
    order: sequelize.literal('id ASC'),
    raw:true
    // offset:5,
    // limit:10,
    // group:'age'
  });
  // console.log(users);  
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
    // await sequelize.sync({ alter:true });

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




// const insertCustomers = async() => {
//   // await sequelize.sync({ alter:true });
//   const user = await  Customers.create({ 
//     fname:"Hardevsinh", 
//     lname:"Zaala", 
//   });
//   console.log("Inserted SuccessFully");
// }
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


// ---> Asscociations
const Asscociations = async() => {
  // await sequelize.sync({ alter:true });

  // ---> One to One
  // A.hasOne(B , {
  //   foreignKey:'myFoodId',
  // });
  // B.belongsTo(A);


  // ---> One to Many
  const Team = sequelize.define('Team');
  const Player = sequelize.define('Player');

  Team.hasMany(Player , {
    foreignKey:'clubId' ,
  });
  Player.belongsTo(Team);

  // ---> Many to Many Association <---
  const Movie = sequelize.define('Movie' , { name: DataTypes.STRING });
  const Actor = sequelize.define('Actor' , { name: DataTypes.STRING });

  // Movie.belongsToMany(Actor , { through: 'ActorMovies' });
  // Actor.belongsToMany(Movie , { through: 'ActorMovies' });

  const ActorMovies = sequelize.define('ActorMovies' , {
    MovieId:{
      type:DataTypes.INTEGER , 
      references:{ model:Movie , key:'id' },
    },
    ActorId:{
      type:DataTypes.INTEGER,
      references:{ model:Actor , key:'id' }
    }
  });
  Movie.belongsToMany(Actor , { through: 'ActorMovies' });
  Actor.belongsToMany(Movie , { through: 'ActorMovies' });


  const Ship = sequelize.define('ship' , {
    name:{ type:DataTypes.TEXT  },
    crewCapacity:{ type:DataTypes.INTEGER },
    amountOfSails:{ type:DataTypes.INTEGER },
  },
  { timestamps:false }
  );


  const Captain = sequelize.define('captain' , {
    name:{ type:DataTypes.TEXT  },
    skillLevel:{
      type:DataTypes.INTEGER , 
      validate:{ min:1 , max:10 }
    },
  },
  { timestamps:false }
  );
  
  Captain.hasOne(Ship);
  Ship.belongsTo(Captain);

};
// Asscociations();



// Paranoids (For Soft/Hard delete and Restoring Soft Deletions)
const Paranoid = async() => {
  // let para = await Post.create({ firstName:"Abhishek" , lastName:"Zakhariya" });
  // console.log(para instanceof Post); // True
  // await para.destroy(); // Would just set the `deletedAt` flag
  // await para.destroy({ force:true }); // Delete Record From DataBase

  
  // await Post.destroy({where:{id:[1,2,3,4,8]}});
  // Post.restore({ where:{id:8} });

  // await Post.destroy({where:{id:10}})
  await Post.findByPk(10);
}
// Paranoid();


// Eager Laoding
const EagerLoad = async() => {
  Person.hasMany(Task);
  Task.belongsTo(Person);
  Person.hasMany(Tool, { as: 'Instruments' });

//   const task = await Task.findAll({ raw:true , include:Person });
//  console.log(JSON.stringify(task , null ,2));
//  console.log(task);

const user = await Person.findAll({ include:{ model:Task }})
console.log(JSON.stringify(user , null ,2));
}
// EagerLoad();

app.listen(process.env.PORT , () => {
  console.log(`Running on Port: ${ process.env.PORT }`);
}); 