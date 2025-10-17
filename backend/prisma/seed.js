

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCompetences() {
  const competences = [
    "Jardin potager 🍅",
    "Création florale 🌸",
    "Permaculture douce 🌿",
    "Transmission & apprentissage 📚",
    "Tonte & soin des pelouses ✂️"
  ];

  for (const nom of competences) {
    await prisma.competence.upsert({
      where: { nom },
      update: {},
      create: { nom },
    });
  }

  console.log("✅ Compétences insérées !");
};

async function seedUtilisateur() {
  await prisma.utilisateur.createMany({
    data: [
      {
        nom: 'Dupont',
        prenom: 'Alice',
        email: 'alice@example.com',
        mot_de_passe: 'password123',
        role: 'ami_du_vert',
        photo_profil: 'https://img.freepik.com/vecteurs-premium/icones-visages-jolies-filles-cheveux-colores-filles-gaies-cheveux-colores-illustration-vectorielle-isolee-fond-blanc_528104-490.jpg?w=826',
        biographie: "Herboriste passionnée, je cultive des plantes médicinales et prépare des tisanes pour toute la famille.",
        date_inscription: new Date(),
        telephone: '0601010101',
        adresse: '10 rue des Lilas, Paris',
        note_moyenne: 4.7,
      },
      {
        nom: 'Martin',
        prenom: 'Lucas',
        email: 'lucas@example.com',
        mot_de_passe: 'securepass',
        role: 'proprietaire',
        photo_profil: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-homme_24908-81754.jpg',
        biographie: "J’ai transformé mon terrain urbain en havre de biodiversité. J’accueille avec plaisir ceux qui veulent jardiner.",
        date_inscription: new Date(),
        telephone: '0602020202',
        adresse: '25 avenue des Champs, Lyon',
        note_moyenne: 4.9,
      },
      {
        nom: 'Durand',
        prenom: 'Emma',
        email: 'emma@example.com',
        mot_de_passe: 'mypassword',
        role: 'ami_du_vert',
        photo_profil: 'https://img.freepik.com/vecteurs-libre/femme-portant-lunettes_24908-81919.jpg',
        biographie: "Débutante enthousiaste, j’ai soif d’apprendre les bases du jardinage naturel et de la permaculture.",
        date_inscription: new Date(),
        telephone: '0603030303',
        adresse: '3 rue Verte, Marseille',
        note_moyenne: 4.5,
      },
      {
        nom: 'Bernard',
        prenom: 'Hugo',
        email: 'hugo@example.com',
        mot_de_passe: 'pass1234',
        role: 'proprietaire',
        photo_profil: 'https://img.freepik.com/vecteurs-libre/homme-blond-lunettes_24908-81528.jpg',
        biographie: "Mon jardin, c’est mon refuge. J’y cultive légumes, fleurs et idées. Toujours heureux de partager cet espace.",
        date_inscription: new Date(),
        telephone: '0604040404',
        adresse: '18 rue de l’Admin, Lille',
        note_moyenne: 4.8,
      },
      {
        nom: 'Lemoine',
        prenom: 'Chloé',
        email: 'chloe@example.com',
        mot_de_passe: 'abc123',
        role: 'ami_du_vert',
        photo_profil: 'https://img.freepik.com/vecteurs-libre/photo-compte-profil-femme_24908-81036.jpg',
        biographie: "Fascinée par les fleurs comestibles et les plantes grimpantes, je cherche à en apprendre davantage chaque jour.",
        date_inscription: new Date(),
        telephone: '0605050505',
        adresse: '5 allée des Roses, Toulouse',
        note_moyenne: 4.6,
      }
    ],
  });

  console.log('✅ Utilisateurs insérés.');

  // Attribution aléatoire de compétences aux amis_du_vert
  const amisDuVert = await prisma.utilisateur.findMany({ where: { role: 'ami_du_vert' } });
  const competences = await prisma.competence.findMany();

  function getRandomCompetences(array, n) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  for (const utilisateur of amisDuVert) {
    const selection = getRandomCompetences(competences, 3);
    for (const comp of selection) {
      await prisma.utilisateurCompetence.create({
        data: {
          id_utilisateur: utilisateur.id_utilisateur,
          id_competence: comp.id_competence
        }
      });
    }
    console.log(`🔗 Compétences liées à ${utilisateur.prenom} ${utilisateur.nom}`);
  }
};

async function seedReservation() {
  const utilisateurLucas = await prisma.utilisateur.findUnique({ where: { email: 'lucas@example.com' } });
  const utilisateurHugo  = await prisma.utilisateur.findUnique({ where: { email: 'hugo@example.com' } });

  const jardinLucas = await prisma.jardin.findFirst({ where: { titre: 'Jardin fleuri de Lucas' } });
  const jardinHugo  = await prisma.jardin.findFirst({ where: { titre: 'Potager de Hugo' } });

  if (!utilisateurLucas || !utilisateurHugo || !jardinLucas || !jardinHugo) {
    throw new Error("Certains utilisateurs ou jardins n'ont pas été trouvés. Vérifie les seeds.");
  }

  await prisma.reservation.createMany({
    data: [
      {
        id_utilisateur: utilisateurHugo.id_utilisateur,
        id_jardin: jardinLucas.id_jardin,
        id_disponibilite: null,
        statut: 'confirmée',
        commentaires: 'Je viendrai avec mes outils 🌿',
      },
      {
        id_utilisateur: utilisateurLucas.id_utilisateur,
        id_jardin: jardinHugo.id_jardin,
        id_disponibilite: null,
        statut: 'en attente',
        commentaires: 'Première expérience de jardinage !',
      },
    ],
  });

  console.log('✅ Réservations insérées avec succès.');
};

async function seedJardin() {
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




async function main() {
  console.log("👉 Lancement de main()");

 

  await seedCompetences();
  console.log("✅ seedCompetences terminé");

  await seedUtilisateur();
  console.log("✅ seedUtilisateur terminé");

  await seedJardin();
  console.log("✅ seedJardin terminé");

  await seedReservation();
  console.log("✅ seedReservation terminé");
}

main()
  .then(async () => {
    console.log('🎉 Tous les seeds exécutés avec succès.');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Erreur pendant le seed :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
