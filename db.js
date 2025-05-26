const { Sequelize } = require("sequelize"); 
var bdd = new Sequelize("database", "username", 
"password", { 
host: "localhost", 
dialect: "mysql", 
}); 
await bdd.authenticate(); 
module.exports = bdd; 