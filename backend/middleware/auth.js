const jwt = require("jsonwebtoken");

// Middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.
module.exports = (req, res, next) => {
  try {
    //extraction du token du header Authorization de la requête entrante. On utilise la fonction split pour récupérer tout après l'espace dans le header
    const token = req.headers.authorization.split(" ")[1];
    //la fonction verify pour décoder le token. Si celui-ci n'est pas valide, une erreur sera générée
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    //On extraie l'ID utilisateur du token 
    const userId = decodedToken.userId;
    //si la demande contient un ID utilisateur, on le compare à celui extrait du token. S'ils sont différents, on génère une erreur 
    if (req.body.userId && req.body.userId !== userId) {
      throw "User Id non valable";
    //dans le cas contraire, tout fonctionne et l'utilisateur est authentifié. On passe l'exécution à l'aide de la fonction next()
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Requête non authentifiée"),
    });
  }
};