const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importation des modèles
const { sequelize, User, Card, Collection } = require("./models");

// Synchronisation de la base
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Base de données synchronisée !"))
  .catch(err => console.error("❌ Erreur de synchronisation :", err));

// Routes principales
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API TCG",
    data: {}
  });
});

// Modules
const users = require("./modules/users");
const cards = require("./modules/cards");
const enchere = require("./modules/enchere");
const convertRoute = require("./modules/convert");

// Routes utilisateurs
app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.get("/user", users.GetUser);
app.post("/disconnect", users.Disconnect);

// Routes cartes
app.get("/cards", cards.GetAllCards);
app.post("/booster", cards.OpenBooster);

// Routes enchères
app.post("/enchere", enchere.createEnchere);
app.get("/encheres", enchere.getEncheres); 
app.post("/placer-enchere", enchere.placeBid); 

// Route conversion de carte
app.post("/convert", convertRoute.ConvertCard);

// Démarrage du serveur
app.listen(3000, () => {
  console.log("✅ Serveur lancé sur http://localhost:3000");
});
