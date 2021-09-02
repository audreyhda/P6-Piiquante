//Package de chiffrement
const bcrypt = require ("bcrypt");
//Package pour  créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

// Fonction créer l'utilisateur et sauvegarde 
exports.signup = (req, res, next) => { // Inscription du user
    bcrypt.hash(req.body.password, 10) // Appel fonction de hachage de bcrypt dans  mdp et  « saler » le mdp 10 fois

    //création nouvel utilisateur et enregistrement dans la BDD, on renvoie une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec
    .then( hash => {
        const user = new User ({ // Créé nouveau utilisateur
            email: req.body.email, // Adresse mail masquée 
            password: hash // Hash sauvegardé dans la base de données
        });
        user.save() // Mongoose stocke dans la base de données
        .then( hash => res.status(201).json({ message: 'Utilisateur créé!'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
  };
//méthode permettant de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
exports.login = (req, res, next) => { // Connexion de l'utilisateur
    User.findOne({ email: maskedMail }) // Vérifie que l'adresse mail figure bien dan la base de données
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // Compare le mdp entré par utilisateur avec le hash enregistré dans la BDD
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ 
              userId: user._id,
              token: jwt.sign( // Génère un token de session pour l'utilisateur maintenant connecté
              //// Mongoose qui facilite les interactions avec notre base de données MongoDB
              //ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
                  { userId: user._id},
                  //chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) ;
                  'RANDOM_TOKEN_SECRET',
                  //durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures
                  { expiresIn: '24h'}
              )             
            })          
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };