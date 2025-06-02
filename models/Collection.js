const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Définition du modèle Collection 
const Collection = sequelize.define("Collection", {
  // Quantité de cartes possédées par l'utilisateur (par défaut 1)
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
}, {
  // table dans la base de données
  tableName: "Collections"
});

// Exportation du modèle
module.exports = Collection;
