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

app.post("/register", users.RegisterUser);
app.post("/login", users.Login);
app.get("/user", users.GetUser);
app.post("/disconnect", users.Disconnect);

app.get("/cards", cards.GetAllCards);
app.post("/booster", cards.OpenBooster);


// Enchères
const enchere = require("./modules/enchere");

app.post("/enchere", enchere.CreateEnchere);
app.post("/encherir", enchere.PlacerEnchere);
app.get("/encheres", enchere.GetEncheres);
app.post("/cloturer", enchere.CloturerEnchere);

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
