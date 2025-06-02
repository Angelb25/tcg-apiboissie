const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Définition du modèle Card 
const Card = sequelize.define("Card", {
  // Nom de la carte 
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Rareté de la carte 
  rarity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // URL de l'image de la carte 
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  // Table base de données
  tableName: "Cards"
});

// Exportation du modèle 
module.exports = Card;
