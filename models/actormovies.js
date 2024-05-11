const { Sequelize, DataTypes, Model, QueryTypes, HasOne, HasMany } = require('sequelize');
const { sequelize } = require('../config/database');


    // ---> Many to Many Association <---
    exports.Movie = sequelize.define('Movie' , { name: DataTypes.STRING });
    exports.Actor = sequelize.define('Actor' , { name: DataTypes.STRING });
  
    // Movie.belongsToMany(Actor , { through: 'ActorMovies' });
    // Actor.belongsToMany(Movie , { through: 'ActorMovies' });
  
    exports.ActorMovies = sequelize.define('ActorMovies' , {
      MovieId:{
        type:DataTypes.INTEGER , 
        references:{ model:this.Movie , key:'id' },
      },
      ActorId:{
        type:DataTypes.INTEGER,
        references:{ model:this.Actor , key:'id' }
      }
    });
  

    exports.Team = sequelize.define('Team');
    exports.Player = sequelize.define('Player');