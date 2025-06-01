// Importation des modules nécessaires
const fs = require("fs"); // Pour lire/écrire des fichiers
const path = require("path"); // Pour gérer les chemins de fichiers
const { Op } = require("sequelize");
const User = require("../models/User");

// Chemin vers le fichier contenant les utilisateurs
const dataFilePath = path.join(__dirname, "../data/users.json");

// Fonction pour enregistrer un nouvel utilisateur (DB)
async function RegisterUser(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Erreur : Données manquantes", data: {} });
  }
  const { username, password } = req.body;
  try {
    // Vérifie si l'utilisateur existe déjà
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: "Erreur : Utilisateur déjà existant", data: {} });
    }
    // Création de l'utilisateur
    const newUser = await User.create({ username, password });
    res.json({ message: "Utilisateur créé avec succès", data: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Fonction pour générer un token aléatoire (non utilisée dans le reste du code ici)
function generateToken(length = 16) {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Fonction de connexion d'un utilisateur (DB)
async function Login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username ou mot de passe manquant", data: {} });
  }
  try {
    const user = await User.findOne({ where: { username, password } });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable", data: {} });
    }
    // Génération d’un token
    const token = Math.random().toString(36).substring(2, 12).toUpperCase();
    user.token = token;
    await user.save();
    res.json({ message: "Authentification réussie", data: { token } });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Fonction pour obtenir les informations d’un utilisateur via un token (DB)
async function GetUser(req, res) {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ message: "Erreur : Token manquant", data: {} });
  }
  try {
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(403).json({ message: "Erreur : Token invalide", data: {} });
    }
    // TODO: Ajouter la collection si modèle Collection existe
    res.json({ message: "Utilisateur trouvé", data: user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Fonction de déconnexion d’un utilisateur (DB)
async function Disconnect(req, res) {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "Erreur : Token manquant", data: {} });
  }
  try {
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(403).json({ message: "Erreur : Token invalide", data: {} });
    }
    user.token = null;
    await user.save();
    res.json({ message: "Déconnexion réussie", data: {} });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Exportation des fonctions 
module.exports = {
    RegisterUser,
    Login,
    GetUser,
    Disconnect
};
