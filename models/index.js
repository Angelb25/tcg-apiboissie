const sequelize = require("../db");
const User = require("./User");
const Card = require("./Card");
const Collection = require("./Collection");

// Un utilisateur possède plusieurs cartes dans sa collection
User.hasMany(Collection);
Collection.belongsTo(User);

// Une carte peut appartenir à plusieurs utilisateurs
Card.hasMany(Collection);
Collection.belongsTo(Card);

module.exports = {
  sequelize,
  User,
  Card,
  Collection
};
