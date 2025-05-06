// Importation des modules nécessaires
const fs = require("fs"); // Pour lire/écrire des fichiers
const path = require("path"); // Pour gérer les chemins de fichiers

// Chemin vers le fichier contenant les utilisateurs
const dataFilePath = path.join(__dirname, "../data/users.json");

// Fonction pour enregistrer un nouvel utilisateur
function RegisterUser(req, res) {
    // Vérifie que le corps de la requête contient un nom d'utilisateur et un mot de passe
    if (!req.body || !req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Erreur : Données manquantes", data: {} });
    }
  
    const { username, password } = req.body;
    // Lecture et parsing du fichier JSON contenant les utilisateurs
    let users = JSON.parse(fs.readFileSync(dataFilePath));
  
    // Vérifie si l'utilisateur existe déjà
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: "Erreur : Utilisateur déjà existant", data: {} });
    }
  
    // Génération d'un nouvel ID utilisateur
    const newId = users.length ? users[users.length - 1].id + 1 : 1;

    // Création de l'objet utilisateur
    const newUser = {
      id: newId,
      username,
      password,
      collection: [],
      token: null
    };
  
    // Ajoute le nouvel utilisateur à la liste
    users.push(newUser);
    // Enregistre la liste mise à jour dans le fichier JSON
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
  
    // Répond avec succès
    res.json({ message: "Utilisateur créé avec succès", data: newUser });
}

// Fonction pour générer un token aléatoire (non utilisée dans le reste du code ici)
function generateToken(length = 16) {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Fonction de connexion d'un utilisateur
function Login(req, res) {
    const { username, password } = req.body;

    // Vérifie que le nom d'utilisateur et le mot de passe sont fournis
    if (!username || !password) {
        return res.status(400).json({ message: "Username ou mot de passe manquant", data: {} });
    }

    // Lecture du fichier contenant les utilisateurs
    const users = JSON.parse(fs.readFileSync('data/users.json'));
    
    // Recherche d’un utilisateur correspondant aux identifiants
    const user = users.find(u => u.username === username && u.password === password);

    // Si aucun utilisateur trouvé
    if (!user) {
        return res.status(401).json({ message: "Utilisateur introuvable", data: {} });
    }

    // Génération d’un token 
    const token = Math.random().toString(36).substring(2, 12).toUpperCase();
    user.token = token;

    // Mise à jour du fichier avec le nouveau token
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));

    // Réponse avec le token
    res.json({ message: "Authentification réussie", data: { token } });
}

// Fonction pour obtenir les informations d’un utilisateur via un token
function GetUser(req, res) {
    const token = req.query.token;

    // Vérifie que le token est présent
    if (!token) {
        return res.status(400).json({ message: "Erreur : Token manquant", data: {} });
    }

    // Lecture du fichier JSON
    const users = JSON.parse(fs.readFileSync(dataFilePath));
    // Recherche d’un utilisateur avec le token donné
    const user = users.find(u => u.token === token);

    // Si aucun utilisateur n’est trouvé
    if (!user) {
        return res.status(403).json({ message: "Erreur : Token invalide", data: {} });
    }

    // Réponse avec les données de l’utilisateur
    res.json({ message: "Utilisateur trouvé", data: user });
}

// Fonction de déconnexion d’un utilisateur
function Disconnect(req, res) {
    const token = req.body.token;

    // Vérifie que le token est fourni
    if (!token) {
        return res.status(400).json({ message: "Erreur : Token manquant", data: {} });
    }

    // Lecture du fichier JSON
    const users = JSON.parse(fs.readFileSync(dataFilePath));
    // Recherche de l’utilisateur correspondant au token
    const user = users.find(u => u.token === token);

    // Si aucun utilisateur trouvé
    if (!user) {
        return res.status(403).json({ message: "Erreur : Token invalide", data: {} });
    }

    // Suppression du token 
    user.token = null;
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

    res.json({ message: "Déconnexion réussie", data: {} });
}

// Exportation des fonctions 
module.exports = {
    RegisterUser,
    Login,
    GetUser,
    Disconnect
};
