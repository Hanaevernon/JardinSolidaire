// Cette config Babel est utilisée uniquement pour Jest
// Renomme ce fichier en "babel.jest.config.js" pour éviter le conflit avec Next.js
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ]
};
