const mongoose = require('mongoose');// Mongoose qui facilite les interactions avec notre base de données MongoDB
// Valide l'email unique
const uniqueValidator = require('mongoose-unique-validator');

// Deux utilisateurs ne peuvent pas utiliser la même adresse mail
const userSchema = mongoose.Schema({
  // Adresse mail + user unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);// Rajouter plugin unique validateur à userschema

module.exports = mongoose.model('User', userSchema);