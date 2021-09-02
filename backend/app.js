//IMPORTATIONS
const express = require('express'); // Importation de express (framework node.js)
const bodyParser = require('body-parser'); // Pour récuperer des données exploitable , Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande
const mongoose = require('mongoose'); // Mongoose qui facilite les interactions avec notre base de données MongoDB
const path = require('path');// Necessaire pour multer, importation de fichier comme les images

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const mongoSanitize = require('express-mongo-sanitize'); // Nettoie les données fournies par l'utilisateur pour empêcher l'injection d'opérateur MongoDB. Sanitize untrusted HTML
const xss = require('xss-clean'); // Nettoie user input des POST body, GET queries, et url params pour prevenir les attaques CROSS-site XSS
const helmet = require("helmet");// Plugin de sécurité pour diverses attaques
// Importation de HPP (HTTP Parameter Pollution) Helmet helps you secure your Express apps by setting various HTTP headers
const hpp = require('hpp');
// Utilisation de express-session pour sécuriser les sessions utilisateurs côté serveur, Express middleware to protect against HTTP Parameter Pollution attacks
let session = require('express-session');
const sessionKey = process.env.SECRET_SESSION_KEY;


//Connecte l'API à la base de données MongoDB grâce à Mongoose
mongoose.connect(process.env.DB,
    process.env.database,
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true}
)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express(); // Permet de créer une application express


//CORS - Cross Origin Resource Sharing  La sécurité CORS est une mesure de sécurité par défaut pour empêcher l'utilisation de ressources par des origines non-autorisées. (empêches les requetes malveillante.)
app.use((req, res, next) => {
    // Accès à API depuis n'importe qu'elle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Ajout headers mentionnés aux requêtes envoyées vers API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//Requêtes exploitables (Transformer le corps de la requête, fonction json comme middleware global pour application , en objet javascript utilisable grâce à la méthode json() de bodyParser)
app.use(bodyParser.json());
//// To remove data
app.use(mongoSanitize());
app.use(xss());
app.use(helmet()); // Exécution du plugin de sécurité
app.use(hpp());  // Utilisation de HPP pour sécuriser les requêtes de l'API

// Utilisation d'Express-session pour sécuriser les sessions de l'API
var sess = {
    secret: "'" + sessionKey + "'",
    cookie: {},
    resave: false,
    saveUninitialized: true,
  }
  // S'il s'agit d'un environnement de production
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // Faire confiance au proxy n°1
    sess.cookie.secure = true // sécuriser le cookie de session
  }
  app.use(session(sess));
//Ajout gestionnaire de routage: indique à Express gestion de la ressource image de façon statique
app.use('/images', express.static(path.join(__dirname, 'images'))); 

//Importation routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Exportation de l'application app.js pour pouvoir y accéder d'un autre fichier
module.exports = app;