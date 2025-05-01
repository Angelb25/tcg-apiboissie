const express = require("express");
const app = express();
const users = require("./modules/users");
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // 👈 nécessaire pour lire le JSON

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

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});
