const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/encheres.json");
const userFilePath = path.join(__dirname, "../data/users.json");
const cardFilePath = path.join(__dirname, "../data/cards.json");

function load(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}

// Fonction pour sauvegarder les données dans un fichier JSON
function save(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Fonction pour créer une enchère
function CreateEnchere(req, res) {
  const { token, card_id } = req.body; // Récupération des données envoyées

  // Chargement des données utilisateurs, cartes et enchères
  const users = load(userFilePath);
  const cards = load(cardFilePath);
  const encheres = load(dataFilePath);

  // Vérification de l'existence de l'utilisateur via le token
  const user = users.find(u => u.token === token);
  if (!user) return res.status(403).json({ message: "Token invalide", data: {} });

  // Vérification que l'utilisateur possède bien la carte
  if (!user.collection.includes(card_id)) {
    return res.status(403).json({ message: "Vous ne possédez pas cette carte", data: {} });
  }

  // Suppression de la carte de la collection de l'utilisateur
  user.collection = user.collection.filter(id => id !== card_id);

  // Création d'une nouvelle enchère
  const newEnchere = {
    id: encheres.length ? encheres[encheres.length - 1].id + 1 : 1, // ID auto-incrémenté
    card_id,                      // Carte mise en vente
    seller_id: user.id,          // ID de l'utilisateur qui met en vente
    end_date: Date.now() + 60 * 60 * 1000, // Date de fin dans 1h
    bidder_id: null,              // Aucun enchérisseur pour l'instant
    bid: 0                        // Prix initial
  };

  // Ajout de l’enchère à la liste
  encheres.push(newEnchere);

  // Sauvegarde des changements
  save(userFilePath, users);
  save(dataFilePath, encheres);

  // Réponse au client
  res.json({ message: "Enchère créée", data: newEnchere });
}

// Fonction pour obtenir la liste des enchères
function GetEncheres(req, res) {
  const encheres = load(dataFilePath); // Chargement des enchères
  res.json({ message: "Liste des enchères", data: encheres }); // Envoi de la réponse
}

function PlacerEnchere(req, res) {
  const { token, enchere_id, montant } = req.body; // Données de la requête

  const users = load(userFilePath);     // Chargement des utilisateurs
  const encheres = load(dataFilePath);  // Chargement des enchères

  // Vérification de l'utilisateur
  const user = users.find(u => u.token === token);
  if (!user) return res.status(403).json({ message: "Token invalide", data: {} });

  // Recherche de l’enchère
  const enchere = encheres.find(e => e.id === enchere_id);
  if (!enchere) return res.status(404).json({ message: "Enchère introuvable", data: {} });

  // L'utilisateur ne peut pas enchérir sur sa propre enchère
  if (enchere.seller_id === user.id) {
    return res.status(403).json({ message: "Vous ne pouvez pas enchérir sur votre propre enchère", data: {} });
  }

  // Vérification du montant de l'utilisateur
  if (user.money < montant) {
    return res.status(403).json({ message: "Solde insuffisant", data: {} });
  }

  // Le montant proposé doit être supérieur à l’enchère actuelle
  if (montant <= enchere.bid) {
    return res.status(400).json({ message: "Montant trop faible", data: {} });
  }

  if (enchere.bidder_id) {
    const oldBidder = users.find(u => u.id === enchere.bidder_id);
    if (oldBidder) oldBidder.money += enchere.bid;
  }

  user.money -= montant;
  enchere.bidder_id = user.id;
  enchere.bid = montant;

  // Sauvegarde des modifications
  save(userFilePath, users);
  save(dataFilePath, encheres);

  res.json({ message: "Enchère placée", data: enchere });
}

// Fonction pour clôturer une enchère
function CloturerEnchere(req, res) {
  const { token, enchere_id } = req.body; 

  // Chargement des données nécessaires
  const users = load(userFilePath);
  const cards = load(cardFilePath);
  const encheres = load(dataFilePath);

  // Vérification de l'utilisateur
  const user = users.find(u => u.token === token);
  if (!user) return res.status(403).json({ message: "Token invalide", data: {} });

  const enchereIndex = encheres.findIndex(e => e.id === enchere_id);
  if (enchereIndex === -1) return res.status(404).json({ message: "Enchère introuvable", data: {} });

  const enchere = encheres[enchereIndex];

  // Vérification que l’enchère est terminée
  if (Date.now() < enchere.end_date) {
    return res.status(400).json({ message: "L’enchère n’est pas encore terminée", data: {} });
  }

  // Seul le vendeur ou le gagnant peut clôturer
  if (![enchere.seller_id, enchere.bidder_id].includes(user.id)) {
    return res.status(403).json({ message: "Non autorisé à clôturer cette enchère", data: {} });
  }

  // Récupération des utilisateurs concernés
  const seller = users.find(u => u.id === enchere.seller_id);
  const buyer = users.find(u => u.id === enchere.bidder_id);

  if (buyer) buyer.collection.push(enchere.card_id);
  if (seller && enchere.bid > 0) seller.money += enchere.bid;

  // Suppression de l’enchère
  encheres.splice(enchereIndex, 1);

  // Sauvegarde des données
  save(userFilePath, users);
  save(dataFilePath, encheres);

  // Réponse
  res.json({ message: "Enchère clôturée", data: {} });
}

// Export des fonctions 
module.exports = {
  CreateEnchere,
  GetEncheres,
  PlacerEnchere,
  CloturerEnchere
};
