const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Card = sequelize.define("Card", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rarity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "Cards"
});

module.exports = Card;
