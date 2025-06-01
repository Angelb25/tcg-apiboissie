🎮 API TCG Pokémon – Documentation

Bienvenue dans l’API REST de gestion de cartes Pokémon. Cette API permet à un utilisateur de s’enregistrer, de s'authentifier et d’ouvrir des boosters.

🛠️ Pré-requis
Node.js
MySQL
Sequelize ORM
WAMP pour hébergement local

🔐 Authentification
Toutes les routes nécessitent un header avec le token JWT fourni à la connexion.

📌 Endpoints
🔹 POST /register
Enregistrement d’un nouvel utilisateur.

Paramètres (JSON) :
{
  "username": "exemple",
  "password": "monmotdepasse"
}
🔹 POST /login
Connexion d’un utilisateur et retour du token.

Paramètres (JSON) :
{
  "username": "exemple",
  "password": "monmotdepasse"
}

🔹 GET /user
Récupère les informations du profil + collection.

Headers :
Authorization: JWT_TOKEN

🔹 GET /cards
Liste de toutes les cartes disponibles.

🔹 POST /booster
Ouvre un booster (5 cartes aléatoires) et les ajoute à la collection.

🔹 POST /convert
Convertit une carte doublon en monnaie interne.

Paramètres (JSON) :
{
  "cardId": 1
}

🔹 POST /disconnect
Déconnecte un utilisateur (statique/local – optionnel).

💸 Règles de conversion
Rareté	Monnaie obtenue
Common	5
Uncommon	10
Rare	20
Legendary	50

📁 Structure des modèles (Sequelize)
User : id, username, password, currency
Card : id, name, rarity
Collection : id, userId, cardId, quantity

🧱 Base de données
Générée automatiquement avec :
sequelize.sync({ alter: true });