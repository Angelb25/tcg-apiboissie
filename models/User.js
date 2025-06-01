const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Ton instance Sequelize

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  currency: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: "Users"
});

// Associations éventuelles (à activer si tu as un modèle Collection)
User.associate = (models) => {
  User.hasMany(models.Collection);
};

module.exports = User;

