

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
        nom: 'Vernon',
        prenom: 'Hanaë',
        email: 'hanae@example.com',
        mot_de_passe: 'testhanae',
        role: 'ami_du_vert',
        photo_profil: 'https://randomuser.me/api/portraits/women/44.jpg',
        biographie: "J'adore jardiner et partager mes astuces !",
        date_inscription: new Date(),
        telephone: '0606060606',
        adresse: '1 rue du Jardin, Nantes',
        note_moyenne: 5.0,
      },
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

async function seedJardiniers() {
  const alice = await prisma.utilisateur.findUnique({ where: { email: 'alice@example.com' } });
  const emma = await prisma.utilisateur.findUnique({ where: { email: 'emma@example.com' } });
  const chloe = await prisma.utilisateur.findUnique({ where: { email: 'chloe@example.com' } });

  if (!alice || !emma || !chloe) {
    throw new Error("Certains utilisateurs amis_du_vert n'existent pas. Vérifie les emails !");
  }

  await prisma.jardiniers.createMany({
    data: [
      {
        id_utilisateur: alice.id_utilisateur,
        titre: 'Herboriste expérimentée propose ses services',
        description: 'Passionnée par les plantes médicinales et aromatiques, je propose mes services pour vous aider à créer votre jardin de simples. Je peux vous accompagner dans la création de tisanes maison et vous enseigner les bases de l\'herboristerie.',
        localisation: 'Paris 15ème',
        disponibilites: 'Weekends et mercredis après-midi',
        competences: 'Herboristerie, plantes médicinales, tisanes, jardinage naturel',
        photos: [
          'https://img.freepik.com/photos-gratuite/femme-jardinant-dans-son-jardin_23-2148774916.jpg'
        ],
        date_creation: new Date(),
      },
      {
        id_utilisateur: emma.id_utilisateur,
        titre: 'Apprentie jardinière motivée cherche expérience',
        description: 'Débutante mais très motivée, je souhaite apprendre en participant à vos projets de jardinage. En échange de mon aide, j\'aimerais acquérir de l\'expérience en permaculture et jardinage naturel.',
        localisation: 'Marseille et alentours',
        disponibilites: 'Flexible, tous les jours sauf mardi',
        competences: 'Motivation, apprentissage rapide, jardinage débutant',
        photos: [
          'https://img.freepik.com/photos-gratuite/jeune-femme-plantant-dans-jardin_23-2148774921.jpg'
        ],
        date_creation: new Date(),
      },
      {
        id_utilisateur: chloe.id_utilisateur,
        titre: 'Spécialiste fleurs comestibles et plantes grimpantes',
        description: 'Je me spécialise dans la culture de fleurs comestibles et l\'installation de plantes grimpantes. Je peux vous aider à embellir votre jardin tout en le rendant productif avec des fleurs que vous pourrez cuisiner.',
        localisation: 'Toulouse centre',
        disponibilites: 'Matinées en semaine et samedis',
        competences: 'Fleurs comestibles, plantes grimpantes, aménagement paysager, cuisine des fleurs',
        photos: [
          'https://img.freepik.com/photos-gratuite/arrangement-fleurs-comestibles_23-2148774925.jpg'
        ],
        date_creation: new Date(),
      },
    ],
  });

  console.log('✅ Annonces de jardiniers insérées avec succès !');
};

// Seed pour la messagerie
async function seedMessagerie() {
  // On prend Alice (ami_du_vert) et Lucas (proprietaire)
  const alice = await prisma.utilisateur.findUnique({ where: { email: 'alice@example.com' } });
  const lucas = await prisma.utilisateur.findUnique({ where: { email: 'lucas@example.com' } });
  const hugo = await prisma.utilisateur.findUnique({ where: { email: 'hugo@example.com' } });
  const emma = await prisma.utilisateur.findUnique({ where: { email: 'emma@example.com' } });
  const hanae = await prisma.utilisateur.findUnique({ where: { email: 'hanae@example.com' } });

  if (!alice || !lucas || !hugo || !emma || !hanae) {
    throw new Error("Certains utilisateurs n'existent pas pour la seed messagerie.");
  }

  await prisma.messagerie.createMany({
    data: [
      {
        id_envoyeur: alice.id_utilisateur,
        id_destinataire: lucas.id_utilisateur,
        contenu: "Bonjour Lucas, j'aimerais jardiner dans votre jardin !",
        date_envoi: new Date(),
        lu: false
      },
      {
        id_envoyeur: lucas.id_utilisateur,
        id_destinataire: alice.id_utilisateur,
        contenu: "Bonjour Alice, avec plaisir ! Quand souhaitez-vous venir ?",
        date_envoi: new Date(),
        lu: false
      },
      {
        id_envoyeur: emma.id_utilisateur,
        id_destinataire: hugo.id_utilisateur,
        contenu: "Bonjour Hugo, votre potager m'intéresse beaucoup.",
        date_envoi: new Date(),
        lu: false
      },
      {
        id_envoyeur: hugo.id_utilisateur,
        id_destinataire: emma.id_utilisateur,
        contenu: "Merci Emma, je peux vous faire visiter samedi prochain !",
        date_envoi: new Date(),
        lu: false
      },
      // Ajout d'un message envoyé par Hanaë à Alice
      {
        id_envoyeur: hanae.id_utilisateur,
        id_destinataire: alice.id_utilisateur,
        contenu: "Bonjour Alice, c'est Hanaë ! On peut discuter ici.",
        date_envoi: new Date(),
        lu: false
      }
    ]
  });
  console.log('✅ Messages de test insérés dans la messagerie !');
}

async function main() {
  console.log("👉 Lancement de main()");

  // Nettoyage des tables principales (ordre pour respecter les contraintes de clés étrangères)
  await prisma.messagerie.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.jardiniers.deleteMany();
  await prisma.jardin.deleteMany();
  await prisma.utilisateurCompetence.deleteMany();
  await prisma.competence.deleteMany();
  await prisma.utilisateur.deleteMany();

  console.log('🧹 Tables principales vidées.');

  await seedCompetences();
  console.log("✅ seedCompetences terminé");

  await seedUtilisateur();
  console.log("✅ seedUtilisateur terminé");

  await seedJardin();
  console.log("✅ seedJardin terminé");

  await seedJardiniers();
  console.log("✅ seedJardiniers terminé");

  await seedReservation();
  console.log("✅ seedReservation terminé");
  await seedMessagerie();
  console.log("✅ seedMessagerie terminé");
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
