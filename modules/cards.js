const fs = require('fs');

function GetAllCards(req, res) {
  const cards = JSON.parse(fs.readFileSync('data/cards.json'));
  res.json({
    message: "Liste des cartes disponibles",
    data: cards
  });
}


function OpenBooster(req, res) {
  const token = req.body.token;

  // Récupérer les utilisateurs
  const users = JSON.parse(fs.readFileSync('data/users.json'));
  const user = users.find(u => u.token === token);

  if (!user) {
    return res.status(401).json({ message: "Token invalide", data: {} });
  }

  // Récupérer les cartes
  const cards = JSON.parse(fs.readFileSync('data/cards.json'));

  // Tirer 5 cartes aléatoires (possibilité de doublons pour simplifier)
  const booster = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    booster.push(cards[randomIndex]);
  }

  // Ajouter à la collection de l’utilisateur
  user.collection.push(...booster);

  // Sauvegarder les modifications
  fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));

  // Répondre avec les cartes tirées
  res.json({
    message: "Booster ouvert avec succès",
    data: booster
  });
}

module.exports = {
  GetAllCards,
  OpenBooster
};