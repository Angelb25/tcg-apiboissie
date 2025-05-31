const express = require("express");
const app = express();
const users = require("./modules/users");
const cards = require("./modules/cards");
const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API TCG",
    data: {}
  });
});

// Gestion des utilisateurs
app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.get("/user", users.GetUser);
app.post("/disconnect", users.Disconnect);

// Gestion des cartes
app.get("/cards", cards.GetAllCards);
app.post("/booster", cards.OpenBooster);


// Enchères
const enchere = require("./modules/enchere");
app.post("/enchere", enchere.createEnchere);
app.get("/encheres", enchere.getEncheres); 
app.post("/placer-enchere", enchere.placeBid); 

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
const { ConvertCard } = require("./modules/convert");

app.post("/convert", ConvertCard);

// Endpoint pour toutes les cartes
app.get("/cards", (req, res) => {
  const cards = JSON.parse(fs.readFileSync("./data/cards.json"));
  res.json({ data: cards });
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
