// Module pour lire et écrire des fichiers
const fs = require('fs');

function GetAllCards(req, res) {

  const cards = JSON.parse(fs.readFileSync('data/cards.json'));

  res.json({
    message: "Liste des cartes disponibles",
    data: cards
  });
}

function OpenBooster(req, res) {
  // Récupération du token utilisateur 
  const token = req.body.token;

  const users = JSON.parse(fs.readFileSync('data/users.json'));

  // Recherche de l'utilisateur correspondant au token
  const user = users.find(u => u.token === token);

  if (!user) {
    return res.status(401).json({ message: "Token invalide", data: {} });
  }

  const cards = JSON.parse(fs.readFileSync('data/cards.json'));

  // Création du booster avec 5 cartes tirées aléatoirement 
  const booster = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * cards.length); 
    booster.push(cards[randomIndex]); // Ajout de la carte au booster
  }

  // Ajout des cartes tirées à la collection de l'utilisateur
  user.collection.push(...booster);

  // Sauvegarde des données 
  fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));

  // Envoi de la réponse contenant les cartes obtenues
  res.json({
    message: "Booster ouvert avec succès",
    data: booster
  });
}

module.exports = {
  GetAllCards,
  OpenBooster
};
