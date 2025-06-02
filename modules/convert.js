const fs = require("fs");
const path = require("path");
const usersPath = path.join(__dirname, "../data/users.json");
const cardsPath = path.join(__dirname, "../data/cards.json");

// Fonction pour convertir une carte en monnaie
function ConvertCard(req, res) {
  const { token, cardId } = req.body;

  if (!token || typeof cardId !== "number") {
    return res.status(400).json({ message: "Token ou ID de carte manquant", data: {} });
  }

  // Lecture des données utilisateurs et cartes depuis les fichiers JSON
  const users = JSON.parse(fs.readFileSync(usersPath));
  const cards = JSON.parse(fs.readFileSync(cardsPath));

  // Recherche de l'utilisateur correspondant au token
  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(403).json({ message: "Token invalide", data: {} });
  }

  // Recherche de la carte correspondant à l'ID
  const card = cards.find(c => c.id === cardId);
  if (!card) {
    return res.status(404).json({ message: "Carte non trouvée", data: {} });
  }

  // Vérifie si l'utilisateur possède la carte en double (nb >= 2)
  const cardInCollection = user.collection.find(c => c.id === cardId);
  if (!cardInCollection || cardInCollection.nb < 2) {
    return res.status(400).json({ message: "Impossible de convertir : pas de doublon", data: {} });
  }

  cardInCollection.nb -= 1;

  // gains selon la rareté de la carte
  const rarityValue = {
    common: 1,
    uncommon: 3,
    rare: 5,
    epic: 10,
    legendary: 20
  };

  // Calcule le gain selon la rareté (en minuscule) ou 1 par défaut
  const gain = rarityValue[card.rarity.toLowerCase()] || 1;

  // Ajoute les gains à la monnaie de l'utilisateur
  user.currency = (user.currency || 0) + gain;

  // Sauvegarde des données mises à jour dans le fichier users.json
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  // Réponse de succès avec le nouveau montant de monnaie
  return res.json({ message: `Carte convertie, +${gain} 💰`, data: { currency: user.currency } });
}

// Export de la fonction ConvertCard
module.exports = { ConvertCard };
