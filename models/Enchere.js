const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/encheres.json");
const userFilePath = path.join(__dirname, "../data/users.json");
const cardFilePath = path.join(__dirname, "../data/cards.json");

function load(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}

function save(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Créer une enchère
function CreateEnchere(req, res) {
  const { token, card_id } = req.body;
  const users = load(userFilePath);
  const cards = load(cardFilePath);
  const encheres = load(dataFilePath);

  const user = users.find(u => u.token === token);
  if (!user) return res.status(403).json({ message: "Token invalide", data: {} });

  if (!user.collection.includes(card_id)) {
    return res.status(403).json({ message: "Vous ne possédez pas cette carte", data: {} });
  }

  // Supprimer la carte de la collection
  user.collection = user.collection.filter(id => id !== card_id);

  const newEnchere = {
    id: encheres.length ? encheres[encheres.length - 1].id + 1 : 1,
    card_id,
    seller_id: user.id,
    end_date: Date.now() + 60 * 60 * 1000, // 1 heure plus tard
    bidder_id: null,
    bid: 0
  };

  encheres.push(newEnchere);
  save(userFilePath, users);
  save(dataFilePath, encheres);

  res.json({ message: "Enchère créée", data: newEnchere });
}

// Lister les enchères
function GetEncheres(req, res) {
  const encheres = load(dataFilePath);
  res.json({ message: "Liste des enchères", data: encheres });
}

// Placer une enchère
function PlacerEnchere(req, res) {
  const { token, enchere_id, montant } = req.body;
  const users = load(userFilePath);
  const encheres = load(dataFilePath);

  const user = users.find(u => u.token === token);
  if (!user) return res.status(403).json({ message: "Token invalide", data: {} });

  const enchere = encheres.find(e => e.id === enchere_id);
  if (!enchere) return res.status(404).json({ message: "Enchère introuvable", data: {} });

  if (enchere.seller_id === user.id) {
    return res.status(403).json({ message: "Vous ne pouvez pas enchérir sur votre propre enchère", data: {} });
  }

  if (user.money < montant) {
    return res.status(403).json({ message: "Solde insuffisant", data: {} });
  }

  if (montant <= enchere.bid) {
    return res.status(400).json({ message: "Montant trop faible", data: {} });
  }

  // Rembourser le précédent enchérisseur
  if (enchere.bidder_id) {
    const oldBidder = users.find(u => u.id === enchere.bidder_id);
    if (oldBidder) oldBidder.money += enchere.bid;
  }

  // Débiter le nouveau
  user.money -= montant;
  enchere.bidder_id = user.id;
  enchere.bid = montant;

  save(userFilePath, users);
  save(dataFilePath, encheres);

  res.json({ message: "Enchère placée", data: enchere });
}

// Clôturer une enchère
function CloturerEnchere(req, res) {
  const { token, enchere_id } = req.body;
  const users = load(userFilePath);
  const cards = load(cardFilePath);
  const encheres = load(dataFilePath);

  const user = users.find(u => u.token === token);
  if (!user) return res.status(403).json({ message: "Token invalide", data: {} });

  const enchereIndex = encheres.findIndex(e => e.id === enchere_id);
  if (enchereIndex === -1) return res.status(404).json({ message: "Enchère introuvable", data: {} });

  const enchere = encheres[enchereIndex];

  if (Date.now() < enchere.end_date) {
    return res.status(400).json({ message: "L’enchère n’est pas encore terminée", data: {} });
  }

  if (![enchere.seller_id, enchere.bidder_id].includes(user.id)) {
    return res.status(403).json({ message: "Non autorisé à clôturer cette enchère", data: {} });
  }

  const seller = users.find(u => u.id === enchere.seller_id);
  const buyer = users.find(u => u.id === enchere.bidder_id);

  // Transfert de carte et d'argent
  if (buyer) buyer.collection.push(enchere.card_id);
  if (seller && enchere.bid > 0) seller.money += enchere.bid;

  // Supprimer l’enchère
  encheres.splice(enchereIndex, 1);

  save(userFilePath, users);
  save(dataFilePath, encheres);

  res.json({ message: "Enchère clôturée", data: {} });
}

module.exports = {
  CreateEnchere,
  GetEncheres,
  PlacerEnchere,
  CloturerEnchere
};
