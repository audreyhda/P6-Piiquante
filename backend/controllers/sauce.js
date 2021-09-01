// stock la logique de l'application
const Sauce = require('../models/Sauce');

// file system, package qui permet de modifier et/ou supprimer des fichiers
const fs = require('fs'); 

// Fonction d'ajout d'une nouvelle sauce (requête POST)  
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // On recupère la sauce
    delete sauceObject._id; // L'id sauce supprimé    
    const sauce = new Sauce({ // Nouvel objet sauce est crée
        ...sauceObject, // Copie tous les éléments de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, // Implantation de l'image
    });
    sauce.save() // Sauce sauvegardée 
    .then( () => res.status(201).json({ message: 'Sauce sauvegarder'})) // Promise
    .catch( error => res.status(400).json({ error })) // Erreur
    console.log(sauce);
};

// Fonction modification de l'objet sauce (requête PUT)
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // Vérifie si la modification concerne le body ou un nouveau fichier image et recupere la sauce
    {
      ...JSON.parse(req.body.sauce), // Rend les données exploitable avec JSON.parse
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// Url de l'image enregistrée dans le dossier images du serveur    
    } : { ...req.body };
    //Fonction updateOne pour recuperé la sauce avec son id et modifier les parametres de la sauce
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'Sauce modifier'}))// Retoune également un then et catch
    .catch(()=> res.status(400).json({ error}))
};

//Fonction de suppression d'une sauce (requête DELETE)
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // Identifie la sauce et vient chercher la sauce
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1]; // Récupère l'adresse de l'image
    fs.unlink(`images/${filename}`, () => { // La supprime du serveur
    Sauce.deleteOne({_id: req.params.id}) // Supprime la sauce
    .then(()=> res.status(200).json({ message: 'Sauce supprimé'}))// Retoune également un then et catch
    .catch(error => res.status(400).json({ error}))
    });
  })
  .catch(error => res.status(500).json({ error }));
};

/*
// Fonction like / dislike sauce
exports.likeSauce = (req, res, next) => {    
    const like = req.body.like;
    if(like =1) { //like
        
    } else if(like = -1) { //dislike

    } else { //annulation like ou dislike

    }   
};
*/
exports.getAllSauces = (req, res, next) => { // Récupère toutes les sauces
    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res, next) => {  // Récupère une seule sauce
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};