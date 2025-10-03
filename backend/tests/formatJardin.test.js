// fonctionnalité a tester
const formatJardins = (jardins) =>
  jardins.map((j) => ({
    ...j,
    // On s’assure que id_jardin et id_proprietaire sont castés en string
    id_jardin: j.id_jardin.toString(),
    id_proprietaire: j.id_proprietaire.toString(),
  }));

  describe('formatJardins', () => {
  test('convertit les IDs numériques en chaînes de caractères', () => {
    // Données d’entrée : IDs sous forme de nombres
    const raw = [
      { id_jardin: 1, id_proprietaire: 5, foo: 'bar' },
      { id_jardin: 0, id_proprietaire: 123, baz: 'qux' },
    ];
    // Appel de la fonction
    const formatted = formatJardins(raw);
    // On garde la même longueur de tableau
    expect(formatted).toHaveLength(raw.length);
    // Pour chaque élément :
    formatted.forEach((item, idx) => {
      const original = raw[idx];
      // Les autres propriétés sont inchangées
      Object.keys(original).forEach((key) => {
        if (key !== 'id_jardin' && key !== 'id_proprietaire') {
          expect(item[key]).toBe(original[key]);
        }
      });

      // Les IDs sont transformés en string
      expect(typeof item.id_jardin).toBe('string');
      expect(item.id_jardin).toBe(original.id_jardin.toString());

      expect(typeof item.id_proprietaire).toBe('string');
      expect(item.id_proprietaire).toBe(original.id_proprietaire.toString());
    });
  });

  test('gère un tableau vide sans lever d’erreur', () => {
    // Un tableau vide doit juste renvoyer un tableau vide
    expect(formatJardins([])).toEqual([]);
  });

  test('fonctionne même si les IDs étaient déjà des chaînes', () => {
    const rawStrings = [
      { id_jardin: '42', id_proprietaire: '99', note: 10 },
    ];
    // On ne perd pas l’integrité des chaînes existantes
    const formatted = formatJardins(rawStrings);
    expect(formatted[0].id_jardin).toBe('42');
    expect(formatted[0].id_proprietaire).toBe('99');
    expect(formatted[0].note).toBe(10);
  });
});