const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "../data/users.json");
const cardsPath = path.join(__dirname, "../data/cards.json");

function ConvertCard(req, res) {
  const { token, cardId } = req.body;

  if (!token || typeof cardId !== "number") {
    return res.status(400).json({ message: "Token ou ID de carte manquant", data: {} });
  }

  const users = JSON.parse(fs.readFileSync(usersPath));
  const cards = JSON.parse(fs.readFileSync(cardsPath));

  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(403).json({ message: "Token invalide", data: {} });
  }

  const card = cards.find(c => c.id === cardId);
  if (!card) {
    return res.status(404).json({ message: "Carte non trouvée", data: {} });
  }

  const cardInCollection = user.collection.find(c => c.id === cardId);
  if (!cardInCollection || cardInCollection.nb < 2) {
    return res.status(400).json({ message: "Impossible de convertir : pas de doublon", data: {} });
  }

  // Décrémenter
  cardInCollection.nb -= 1;

  // Ajout monnaie
  const rarityValue = {
    common: 1,
    uncommon: 3,
    rare: 5,
    epic: 10,
    legendary: 20
  };
  const gain = rarityValue[card.rarity.toLowerCase()] || 1;

  user.currency = (user.currency || 0) + gain;

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  return res.json({ message: `Carte convertie, +${gain} 💰`, data: { currency: user.currency } });
}

module.exports = { ConvertCard };
