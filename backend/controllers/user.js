const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User.js");

// Fonction créer l'utilisateur et sauvegarde 
exports.signup = (req, res, next) => { // Inscription du user
    bcrypt.hash(req.body.password, 10) // bcrypt hash mot de passe
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

exports.login = (req, res, next) => { // Connexion de l'utilisateur
    User.findOne({ email: maskedMail }) // Vérifie que l'adresse mail figure bien dan la base de données
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // Compare les mots de passes
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ 
              userId: user._id,
              token: jwt.sign( // Génère un token de session pour l'utilisateur maintenant connecté
                  { userId: user._id},
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h'}
              )             
            })          
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };