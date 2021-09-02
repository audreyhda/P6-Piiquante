// CREATION DU ROUTEUR pour les SAUCES
// Importation du Framework Express pour Node.js
const express = require('express');
// Création du routeur avec Express
const router = express.Router();

// Importation de la logique métier pour la manipulation des sauces
const sauceCtrl = require('../controllers/sauces');
// Importation du Middleware d'authentification
const auth = require('../middleware/auth');
// Importation de Multer pour autoriser les fichiers entrants (images)
const multer = require('../middleware/multer-config');


// Logique metier, routes disponibles dans application
//Application middleware auth.js aux routes avec auth
//Ajout middleware multer à route POST et PUT
router.post('/', auth, multer, sauceCtrl.createSauce);// Envoi des données 
router.put('/:id', auth, multer, sauceCtrl.modifySauce);// Modification de l'id
router.delete('/:id', auth, sauceCtrl.deleteSauce);// Suppression de l'id
router.get('/', auth, sauceCtrl.getAllSauces);// Récupère tout les objets
router.get('/:id', auth, sauceCtrl.getOneSauce);// Envoi de l'identifiant
router.post('/:id/like', auth, sauceCtrl.likeSauce); // like / dislike les sauces

module.exports = router;