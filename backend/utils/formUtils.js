// vérifie les champs requis d’un formulaire “Je veux jardiner”.
// champs obligatoires : nom (Prénom/Nom) et description.
// renvoie la liste des noms de champs manquants.

function getMissingRequiredFields(formData) {
  const missing = [];

  // nom est obligatoire (on considère qu'il sert à la fois pour "Prénom" et "Nom")
  if (!formData.nom || formData.nom.trim() === '') {
    missing.push('nom');
  }

  // description est obligatoire
  if (!formData.description || formData.description.trim() === '') {
    missing.push('description');
  }

  return missing;
}

module.exports = { getMissingRequiredFields };
