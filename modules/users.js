const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/users.json");
function RegisterUser(req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Erreur : Données manquantes", data: {} });
    }
  
    const { username, password } = req.body;
    let users = JSON.parse(fs.readFileSync(dataFilePath));
  
    // Vérifier si l'utilisateur existe déjà
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: "Erreur : Utilisateur déjà existant", data: {} });
    }
  
    const newId = users.length ? users[users.length - 1].id + 1 : 1;
    const newUser = {
      id: newId,
      username,
      password,
      collection: [],
      token: null
    };
  
    users.push(newUser);
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
  
    res.json({ message: "Utilisateur créé avec succès", data: newUser });
  }
function generateToken(length = 16) {
return Math.random().toString(36).substring(2, 2 + length);
}

function Login(req, res) {
const { username, password } = req.body;

if (!username || !password) {
    return res.status(400).json({ message: "Username ou mot de passe manquant", data: {} });
}

const users = JSON.parse(fs.readFileSync('data/users.json'));
const user = users.find(u => u.username === username && u.password === password);

if (!user) {
    return res.status(401).json({ message: "Utilisateur introuvable", data: {} });
}

const token = Math.random().toString(36).substring(2, 12).toUpperCase();
user.token = token;

fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));

res.json({ message: "Authentification réussie", data: { token } });
}
function GetUser(req, res) {
const token = req.query.token;
if (!token) {
    return res.status(400).json({ message: "Erreur : Token manquant", data: {} });
}

const users = JSON.parse(fs.readFileSync(dataFilePath));
const user = users.find(u => u.token === token);

if (!user) {
    return res.status(403).json({ message: "Erreur : Token invalide", data: {} });
}

res.json({ message: "Utilisateur trouvé", data: user });
}
function Disconnect(req, res) {
const token = req.body.token;
if (!token) {
    return res.status(400).json({ message: "Erreur : Token manquant", data: {} });
}

const users = JSON.parse(fs.readFileSync(dataFilePath));
const user = users.find(u => u.token === token);

if (!user) {
    return res.status(403).json({ message: "Erreur : Token invalide", data: {} });
}

user.token = null;
fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

res.json({ message: "Déconnexion réussie", data: {} });
}

module.exports = {
RegisterUser,
Login,
GetUser,
Disconnect
};

