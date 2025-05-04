const fs = require('fs');

function GetAllCards(req, res) {
  const cards = JSON.parse(fs.readFileSync('data/cards.json'));
  res.json({
    message: "Liste des cartes disponibles",
    data: cards
  });
}

module.exports = {
  GetAllCards
};
