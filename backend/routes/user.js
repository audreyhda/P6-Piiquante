
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const rateLimit = require('express-rate-limit'); // Prévenir des attaques force brute

const createAccountLimiter = rateLimit({ // Bloque la connexion aprés plusieurs échec de connexion    
    windowMs: 10 * 60 * 1000, // 10 minutes qui défini pour tester l'application
    max: 3 ,// 3 essais maximum par adresse ip
    message:
    "Too many accounts created from this IP, please try again after an hour"
});
  
router.post('/signup', userCtrl.signup);
router.post('/login',createAccountLimiter, userCtrl.login);

module.exports = router;