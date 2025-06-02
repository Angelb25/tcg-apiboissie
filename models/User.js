const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Ton instance Sequelize

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,      // Type chaîne de caractères
    allowNull: false,            // Champ requis (non nul)
    unique: true                 // Doit être unique dans la base
  },

  password: {
    type: DataTypes.STRING,      // Type chaîne (souvent hashé)
    allowNull: false             // Champ requis
  },

  currency: {
    type: DataTypes.INTEGER,     // Type entier
    defaultValue: 0              // Valeur par défaut : 0
  }
}, {
  // Nom de la table dans la base de données
  tableName: "Users"
});

// Définition des associations avec d'autres modèles
User.associate = (models) => {
  User.hasMany(models.Collection);
};

// Export du modèle User 
module.exports = User;
