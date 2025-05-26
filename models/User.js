const { DataTypes } = require("sequelize");
const bdd = require("../db");

const User = bdd.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  money: { type: DataTypes.INTEGER, defaultValue: 1000 },
});

module.exports = User;
