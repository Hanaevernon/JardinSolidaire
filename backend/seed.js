// seed.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {
  console.log("🚀 Début du script de seed...");

  try {
    // Nettoyage
    await pool.query(`
      TRUNCATE TABLE 
        reservation,
        jardin,
        avis,
        disponibilites,
        messagerie,
        "heurescumulées",
        jardiniers,
        utilisateur,
        competence
      RESTART IDENTITY CASCADE;
    `);
    console.log("🧹 Tables nettoyées.");

    // Compétences
    const competences = [
      "Jardin potager 🍅",
      "Création florale 🌸",
      "Permaculture douce 🌿",
      "Transmission & apprentissage 📚",
      "Tonte & soin des pelouses ✂️",
    ];
    for (const nom of competences) {
      await pool.query(
        `INSERT INTO competence (nom) VALUES ($1) ON CONFLICT (nom) DO NOTHING;`,
        [nom]
      );
    }
    console.log("✅ Compétences insérées.");

    const competenceRows = await pool.query(
      `SELECT id_competence, nom FROM competence;`
    );
    const allCompetences = competenceRows.rows;

    // Utilisateurs
    const utilisateurs = [
      {
        nom: "Dupont",
        prenom: "Alice",
        email: "alice@example.com",
        mot_de_passe: "password123",
        role: "ami_du_vert",
        photo_profil:
          "https://img.freepik.com/vecteurs-premium/icones-visages-jolies-filles-cheveux-colores-filles-gaies-cheveux-colores-illustration-vectorielle-isolee-fond-blanc_528104-490.jpg?w=826",
        biographie: "Herboriste passionnée...",
        telephone: "0601010101",
        adresse: "10 rue des Lilas, Paris",
        note_moyenne: 4.7,
      },
      {
        nom: "Martin",
        prenom: "Lucas",
        email: "lucas@example.com",
        mot_de_passe: "securepass",
        role: "proprietaire",
        photo_profil:
          "https://img.freepik.com/vecteurs-libre/photo-compte-profil-homme_24908-81754.jpg",
        biographie: "J’ai transformé mon terrain urbain...",
        telephone: "0602020202",
        adresse: "25 avenue des Champs, Lyon",
        note_moyenne: 4.9,
      },
      {
        nom: "Durand",
        prenom: "Emma",
        email: "emma@example.com",
        mot_de_passe: "mypassword",
        role: "ami_du_vert",
        photo_profil:
          "https://img.freepik.com/vecteurs-libre/femme-portant-lunettes_24908-81919.jpg",
        biographie: "Débutante enthousiaste...",
        telephone: "0603030303",
        adresse: "3 rue Verte, Marseille",
        note_moyenne: 4.5,
      },
      {
        nom: "Bernard",
        prenom: "Hugo",
        email: "hugo@example.com",
        mot_de_passe: "pass1234",
        role: "proprietaire",
        photo_profil:
          "https://img.freepik.com/vecteurs-libre/homme-blond-lunettes_24908-81528.jpg",
        biographie: "Mon jardin, c’est mon refuge...",
        telephone: "0604040404",
        adresse: "18 rue de l’Admin, Lille",
        note_moyenne: 4.8,
      },
      {
        nom: "Lemoine",
        prenom: "Chloé",
        email: "chloe@example.com",
        mot_de_passe: "abc123",
        role: "ami_du_vert",
        photo_profil:
          "https://img.freepik.com/vecteurs-libre/photo-compte-profil-femme_24908-81036.jpg",
        biographie: "Fascinée par les fleurs comestibles...",
        telephone: "0605050505",
        adresse: "5 allée des Roses, Toulouse",
        note_moyenne: 4.6,
      },
    ];

    const insertedUsers = [];
    for (const u of utilisateurs) {
      const result = await pool.query(
        `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, photo_profil, biographie, date_inscription, telephone, adresse, note_moyenne)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),$8,$9,$10)
         RETURNING id_utilisateur;`,
        [
          u.nom,
          u.prenom,
          u.email,
          u.mot_de_passe,
          u.role,
          u.photo_profil,
          u.biographie,
          u.telephone,
          u.adresse,
          u.note_moyenne,
        ]
      );
      insertedUsers.push({
        ...u,
        id_utilisateur: result.rows[0].id_utilisateur,
      });
    }
    console.log("✅ Utilisateurs insérés.");

    // Attribution aléatoire des compétences aux "ami_du_vert"
    for (const user of insertedUsers.filter((u) => u.role === "ami_du_vert")) {
      const shuffled = allCompetences.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 1);

      // désactivé pour l’instant mais dispo si tu veux relier utilisateur <-> competence
      // for (const comp of selected) {
      //   await pool.query(
      //     `INSERT INTO utilisateurcompetence (id_utilisateur, id_competence) VALUES ($1,$2);`,
      //     [user.id_utilisateur, comp.id_competence]
      //   );
      // }
    }

    // Jardins (lié à Lucas et Hugo)
    const lucas = insertedUsers.find((u) => u.email === "lucas@example.com");
    const hugo = insertedUsers.find((u) => u.email === "hugo@example.com");

    const jardins = [
      {
        id_proprietaire: lucas.id_utilisateur,
        titre: "Jardin fleuri de Lucas",
        description: "Un jardin lumineux avec beaucoup de fleurs.",
        adresse: "25 avenue des Champs, Lyon",
        superficie: 40,
        type: "fleurs",
        besoins: "arrosage, désherbage",
        photos: JSON.stringify([
          "https://img.freepik.com/photos-gratuite/beau-parc-verdoyant_1417-1447.jpg",
        ]),
        statut: "disponible",
        note_moyenne: 4.9,
      },
      {
        id_proprietaire: hugo.id_utilisateur,
        titre: "Potager de Hugo",
        description: "Grand potager à partager avec un passionné.",
        adresse: "18 rue de l’Admin, Lille",
        superficie: 60,
        type: "potager",
        besoins: "plantation, entretien",
        photos: JSON.stringify([
          "https://img.freepik.com/photos-gratuite/sentier-sous-belle-arche-fleurs-plantes_181624-16890.jpg",
        ]),
        statut: "disponible",
        note_moyenne: 4.8,
      },
    ];

    const insertedJardins = [];
    for (const j of jardins) {
      const result = await pool.query(
        `INSERT INTO jardin (id_proprietaire, titre, description, adresse, superficie, type, besoins, photos, date_publication, statut, note_moyenne)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),$9,$10)
         RETURNING id_jardin;`,
        [
          j.id_proprietaire,
          j.titre,
          j.description,
          j.adresse,
          j.superficie,
          j.type,
          j.besoins,
          j.photos,
          j.statut,
          j.note_moyenne,
        ]
      );
      insertedJardins.push({
        ...j,
        id_jardin: result.rows[0].id_jardin,
      });
    }
    console.log("✅ Jardins insérés.");

    // Jardiniers (annonces liées aux utilisateurs amis_du_vert)
    const alice = insertedUsers.find((u) => u.email === "alice@example.com");
    const emma = insertedUsers.find((u) => u.email === "emma@example.com");
    const chloe = insertedUsers.find((u) => u.email === "chloe@example.com");

    const jardiniers = [
  {
    id_utilisateur: alice.id_utilisateur,
    titre: "Alice – Herboriste passionnée",
    description: "Je propose mon aide pour l’entretien des plantes médicinales et aromatiques.",
    localisation: "Paris",
    disponibilites: "Soirs en semaine et week-ends",
    competences: "Plantes médicinales, aromatiques, permaculture",
    photos: ["assets/alice.png"],  // ✅ chemin relatif
  },
  {
    id_utilisateur: emma.id_utilisateur,
    titre: "Emma – Débutante enthousiaste",
    description: "J’aimerais apprendre le jardinage en aidant dans un potager.",
    localisation: "Marseille",
    disponibilites: "Samedi après-midi",
    competences: "Plantation, arrosage",
    photos: ["assets/emma.png"],  // ✅
  },
  {
    id_utilisateur: chloe.id_utilisateur,
    titre: "Chloé – Passion fleurs comestibles",
    description: "Je m’intéresse aux fleurs comestibles et propose mon aide pour des projets créatifs.",
    localisation: "Toulouse",
    disponibilites: "Tous les dimanches",
    competences: "Fleurs, créations florales",
    photos: ["assets/chloe.png"],  // ✅
  },
];


for (const j of jardiniers) {
  await pool.query(
    `INSERT INTO jardiniers 
      (id_utilisateur, titre, description, localisation, disponibilites, competences, photos, date_creation)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW());`,
    [
      j.id_utilisateur,
      j.titre,
      j.description,
      j.localisation,
      j.disponibilites,
      j.competences,
      j.photos, // ✅ tableau JS → Postgres TEXT[]
    ]
  );
}

    console.log("✅ Annonces jardiniers insérées.");

    // Réservations
    const jardinLucas = insertedJardins.find((j) =>
      j.titre.includes("Lucas")
    );
    const jardinHugo = insertedJardins.find((j) =>
      j.titre.includes("Hugo")
    );

    await pool.query(
      `INSERT INTO reservation (id_utilisateur, id_jardin, statut, date_reservation, commentaires)
       VALUES ($1,$2,'confirmée',NOW(),'Je viendrai avec mes outils 🌿'),
              ($3,$4,'en attente',NOW(),'Première expérience de jardinage !');`,
      [hugo.id_utilisateur, jardinLucas.id_jardin, lucas.id_utilisateur, jardinHugo.id_jardin]
    );
    console.log("✅ Réservations insérées.");

    console.log("🎉 Tous les seeds exécutés avec succès.");
  } catch (err) {
    console.error("❌ Erreur pendant le seed :", err);
  } finally {
    await pool.end();
    console.log("🔌 Connexion fermée.");
  }
}

main();
