// hashPassword prend un mot de passe en clair et retourne un mot de passe hashé
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = { hashPassword };
