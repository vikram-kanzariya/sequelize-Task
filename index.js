const { User , A , B , Post , Person , Task , Tool } = require('./models/user');
const { sequelize } = require('./config/database');
const express = require('express');
const { Op, where, DataTypes } = require('sequelize');
const path = require('path');
const  { Actor , Movie , ActorMovies , Team , Player } = require("./models/actormovies");
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

(async() => {
  await sequelize.sync({ alter:true });
})();

// Create User
app.post("/createuser" , async(req , res) => {
  let uname = req.body.uname;
  let password = req.body.password;
  let fname = req.body.fname;
  let lname= req.body.lname;
  let age = req.body.age;

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
    
    // await sequelize.sync({ alter:true });

    const user = await  User.create({ 
      firstName: fname , 
      lastName: lname , 
      age: age ,
      username:uname,
      password:password
    });
    // console.log(user.getDataValue('firstName'));
    return res.redirect("/getusers");
    // return res.json({ success:true , message:"user Created" , data:user})
  } catch (error) {
    console.log('Some Error Occured: ' + error);
  }

});

// Get/Read Users
app.get("/getusers" , async(req , res) => {

  // await sequelize.sync({ alter:true });
  try {
    
    let users = await User.findAll({ 
      order: sequelize.literal('id ASC'),
      raw:true
      // offset:5,
      // limit:10,
      // group:'age'
    });
    // res.json({ data: users });
    return res.render('users' , { data:users })
  } catch (error) {
    console.log("Error: " + error);
  }
});

app.get("/updateuser" , async(req , res) => {
  let uid = req.query.id;

  try {
    let users = await User.findAll({
      where:{
        id:uid
      }
    });
  
    return res.render('update' , { data:users });
  } catch (error) {
    console.log("Error: " + error);
  }
 
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

    return res.json({ success:true , message:"Data Updated.." }).redirect("/getusers");
  } catch (error) {
    console.log(error);
  }

});

// Delete User
app.get("/deleteuser" , async(req , res) => {
  let uid = req.query.id;
  console.log(uid);

  try {
    let user = await User.destroy({
      where:{
        id:uid,
  
      }
    });

    return res.json({ 
      success:true ,
      message:"Deleted SuccessFully.."
    })
  } catch (error) {
    console.log("Error: " + error);
  }

});

// Max/Min Functions
app.get('/age' , async(req , res) => {
  let maxAge = await User.max('age');
  let minage = await User.min('age');

  return res.json({ maxAge , minage })
});


const findUsers = async() => {
  const users = await User.findAll({
    // attributes:[ 'lastName' , [sequelize.fn('COUNT' , sequelize.col('firstName')) , 'fname'] ]
    // attributes:[  [sequelize.fn('max' , sequelize.col('age')) , 'maxage'] ]
    attributes:[  [sequelize.fn('min' , sequelize.col('age')) , 'minage'] ]
  });
  console.log(users);
}
// findUsers();
app.get("/findandcount" , async(req , res) => {
  const { count , rows } = await User.findAndCountAll();

  return res.json({ count , rows });
})


// findandCount();
const findandCount = async() => {
  const { count , rows } = await User.findAndCountAll({
    where:{
      firstName:{ [Op.like] : "%lpe%", }
    }
  })
  console.log(count);
  console.log(rows);
}

app.get("/getter" , async(req , res) => {
  const user = await User.build({ username:req.body });
  return res.json({ 
    message:"Data Founded" ,  
    user:user.getDataValue('username'),
   })
});



app.get("/associations" , async(req ,res) => {
    // ---> Many to Many Association <---
    Movie.belongsToMany(Actor , { through: 'ActorMovies' });
    Actor.belongsToMany(Movie , { through: 'ActorMovies' });

    return res.json({
      success:true , 
      message:"Many to Many Association Fetched",
    })
});

app.post("/manytomany" , async(req , res) => {

  // let ActorData = await Actor.create({ name:"Axay" });
  // let Moviedata = await Movie.create({ name:'dfsdfsdfs' });

  let actorMovies = await ActorMovies.create({ MovieId:1 , ActorId:1 })

  return res.json({   
    success:true , 
    message:"Inserted..."
    // actor:ActorData , movie:Moviedata
  });
});

app.get("/oneone" , async(req , res) => {
  const Data = await B.findAll({
    where:{ myFoodId:1 } , raw:true
  });

  return res.json({ data:Data })
});

const getManytoMany = async() => {
  let dt = await Actor.findAll({ include:ActorMovies.ActorId , raw:true });
  console.log(dt);
}
getManytoMany()

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

//   // ---> One to Many
  const Team = sequelize.define('Team', {
    name:DataTypes.STRING,
  });
  const Player = sequelize.define('Player' , {
    name:DataTypes.STRING
  });

  Team.hasMany(Player , {
    foreignKey:'clubId' ,
  });
  Player.belongsTo(Team);

  // let teams = await Team.create({ name:"delhi" })

//   // const Ship = sequelize.define('ship' , {
//   //   name:{ type:DataTypes.TEXT  },
//   //   crewCapacity:{ type:DataTypes.INTEGER },
//   //   amountOfSails:{ type:DataTypes.INTEGER },
//   // },
//   // { timestamps:false }
//   // );


//   // const Captain = sequelize.define('captain' , {
//   //   name:{ type:DataTypes.TEXT  },
//   //   skillLevel:{
//   //     type:DataTypes.INTEGER , 
//   //     validate:{ min:1 , max:10 }
//   //   },
//   // },
//   // { timestamps:false }
//   // );
  
//   // Captain.hasOne(Ship);
//   // Ship.belongsTo(Captain);


  //   // ---> One to One
  // A.hasOne(B , {
  //   foreignKey:'myFoodId',
  // });
  // B.belongsTo(A);


  // let aData = await A.create({ fname:"Tushar" , lname:"Shinde" });
  // let bData = await B.create({ myFoodId:1 , age:32 , AId:1 });

  // const Data = await B.findAll({
  //   where:{ myFoodId:1 } , raw:true
  // });
  
  // console.log(Data);
};
// Asscociations();



// Paranoids (For Soft/Hard delete and Restoring Soft Deletions)
// const Paranoid = async() => {
//   // let para = await Post.create({ firstName:"Abhishek" , lastName:"Zakhariya" });
//   // console.log(para instanceof Post); // True
//   // await para.destroy(); // Would just set the `deletedAt` flag
//   // await para.destroy({ force:true }); // Delete Record From DataBase

  
//   // await Post.destroy({where:{id:[1,2,3,4,8]}});
//   // Post.restore({ where:{id:8} });

//   // await Post.destroy({where:{id:10}})
//   await Post.findByPk(10);
// }
// Paranoid();


// Eager Laoding
const EagerLoad = async() => {
  Person.hasMany(Task);
  Task.belongsTo(Person);
  Person.hasMany(Tool, { as: 'Instruments' });

//  const task = await Task.findAll({ raw:true , include:Person });
//  console.log(JSON.stringify(task , null ,2));
//  console.log(task);

const user = await Person.findAll({ include:{ model:Task }})
console.log(JSON.stringify(user , null ,2));
}
// EagerLoad();

app.listen(process.env.PORT , () => {
  console.log(`Running on Port: ${ process.env.PORT }`);
}); 