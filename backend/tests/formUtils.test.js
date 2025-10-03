const { getMissingRequiredFields } = require('../utils/formUtils');

describe('getMissingRequiredFields (backend)', () => {
  test('renvoie [] quand nom et description sont correctement remplis', () => {
    const formData = {
      nom: 'Alice Dupont',
      description: 'J\'ai 5 ans d\'expérience en jardinage',
      localisation: 'Paris',
      surface: '20m²',
      services: 'Potager',
      photos: []
    };
    expect(getMissingRequiredFields(formData)).toEqual([]);
  });

  test('signale "nom" si le champ nom est vide ou composé d\'espaces', () => {
    const formData = {
      nom: '   ',
      description: 'Il fait beau dans le jardin',
      localisation: '',
      surface: '',
      services: '',
      photos: []
    };
    expect(getMissingRequiredFields(formData)).toEqual(['nom']);
  });

  test('signale "description" si le champ description est vide', () => {
    const formData = {
      nom: 'Bob Martin',
      description: '',
      localisation: 'Lyon',
      surface: '',
      services: '',
      photos: []
    };
    expect(getMissingRequiredFields(formData)).toEqual(['description']);
  });

  test('signale ["nom","description"] si les deux champs sont vides', () => {
    const formData = {
      nom: '',
      description: '    ',
      localisation: 'Marseille',
      surface: '',
      services: '',
      photos: []
    };

    const missing = getMissingRequiredFields(formData);
    expect(missing.sort()).toEqual(['description', 'nom']);
  });

  test('ne renvoie rien pour les autres champs (seulement nom & description sont obligatoires)', () => {
    const formData = {
      nom: 'Carole',
      description: 'Je jardine en ville',
      localisation: '',
      surface: '',
      services: '',
      photos: []
    };
    expect(getMissingRequiredFields(formData)).toEqual([]);
  });
});
