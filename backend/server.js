//Importation package HTTP de node.js pour avoir les outils pour créer serveur
const http = require('http');
//Importation application app.js
const app = require('./app');
//Importation dotenv package pour utiliser variables d'environnement
const dotenv = require("dotenv");

// Fonction normalizeport renvoie un port valide
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
//paramètrage du port avec méthode .set de Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Fonction errorHandler recherche les différentes erreurs et sont ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//La fonction .createServer()  prend en argument la fonction qui sera appelée à chaque requête reçue par le serveur dans app.js
const server = http.createServer(app);

// Ecoute d'évènements, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
// le serveur écoute les requêtes sur le port
server.listen(port);