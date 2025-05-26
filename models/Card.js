const { DataTypes } = require("sequelize");
const bdd = require("../db");

const Card = bdd.define("Card", {
  name: DataTypes.STRING,
  ownerId: DataTypes.INTEGER,
});

module.exports = Card;
