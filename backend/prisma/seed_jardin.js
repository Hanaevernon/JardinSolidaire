const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

 export default async function seedJardin() {
  const lucas = await prisma.utilisateur.findUnique({ where: { email: 'lucas@example.com' } });
  const hugo  = await prisma.utilisateur.findUnique({ where: { email: 'hugo@example.com' } });

  if (!lucas || !hugo) {
    throw new Error("Lucas ou Hugo n'existe pas. Vérifie leurs emails dans seed_utilisateur.js !");
  }

  await prisma.jardin.createMany({
    data: [
      {
        id_proprietaire: lucas.id_utilisateur,
        titre: 'Jardin fleuri de Lucas',
        description: 'Un jardin lumineux avec beaucoup de fleurs.',
        adresse: '25 avenue des Champs, Lyon',
        superficie: 40,
        type: 'fleurs',
        besoins: 'arrosage, désherbage',
        photos: [
          'https://img.freepik.com/photos-gratuite/beau-parc-verdoyant_1417-1447.jpg'
        ],
        date_publication: new Date(),
        statut: 'disponible',
        note_moyenne: 4.9,
        region: 'Auvergne-Rhône-Alpes'
      },
      {
        id_proprietaire: hugo.id_utilisateur,
        titre: 'Potager de Hugo',
        description: 'Grand potager à partager avec un passionné.',
        adresse: '18 rue de l’Admin, Lille',
        superficie: 60,
        type: 'potager',
        besoins: 'plantation, entretien',
        photos: [
          'https://img.freepik.com/photos-gratuite/sentier-sous-belle-arche-fleurs-plantes_181624-16890.jpg'
        ],
        date_publication: new Date(),
        statut: 'disponible',
        note_moyenne: 4.8,
      },
    ],
  });

  console.log('✅ Jardins insérés avec succès !');
};
