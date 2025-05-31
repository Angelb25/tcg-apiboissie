const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/enchere.json");

// Récupérer toutes les enchères
function getEncheres(req, res) {
  const encheres = JSON.parse(fs.readFileSync(dataFilePath));
  res.json({ message: "Liste des enchères", data: enchere });
}

// Créer une nouvelle enchère
function createEnchere(req, res) {
  res.json({ message: "Créer une enchère - à implémenter", data: {} });
}

// Enchérir
function placeBid(req, res) {
  res.json({ message: "Placer une enchère - à implémenter", data: {} });
}

// Clôturer une enchère
function closeEnchere(req, res) {
  res.json({ message: "Clôturer une enchère - à implémenter", data: {} });
}

// Exporte les fonctions
module.exports = {
  getEncheres,
  createEnchere,
  placeBid,
  closeEnchere
};
