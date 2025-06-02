const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const User = require("../models/User");

// Fonction pour enregistrer un nouvel utilisateur
async function RegisterUser(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Erreur : Données manquantes", data: {} });
  }
  const { username, password } = req.body;
  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: "Erreur : Utilisateur déjà existant", data: {} });
    }
    const newUser = await User.create({ username, password });
    res.json({
      message: "Utilisateur créé avec succès",
      data: { id: newUser.id, username: newUser.username }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Fonction pour générer un token aléatoire
function generateToken(length = 16) {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Fonction de connexion
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
    const token = Math.random().toString(36).substring(2, 12).toUpperCase();
    user.token = token;
    await user.save();
    res.json({ message: "Authentification réussie", data: { token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Fonction pour obtenir les infos d’un utilisateur via son token
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
    res.json({
      message: "Utilisateur trouvé",
      data: {
        id: user.id,
        username: user.username,
        currency: user.currency
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Fonction pour déconnecter un utilisateur
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
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", data: {} });
  }
}

// Export des fonctions
module.exports = {
  RegisterUser,
  Login,
  GetUser,
  Disconnect
};
