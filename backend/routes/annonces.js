const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔹 GET toutes les annonces d'un propriétaire (ses jardins)
router.get("/proprietaire/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const jardins = await prisma.jardin.findMany({
      where: {
        id_proprietaire: BigInt(userId)
      },
      include: {
        utilisateur: {
          select: {
            prenom: true,
            nom: true
          }
        }
      },
      orderBy: {
        date_publication: 'desc'
      }
    });

    // Convertir les BigInt en string pour JSON
    const jardinsJSON = jardins.map(jardin => ({
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString(),
      prenom: jardin.utilisateur.prenom,
      nom: jardin.utilisateur.nom
    }));

    res.json(jardinsJSON);
  } catch (err) {
    console.error("❌ Erreur récupération jardins propriétaire :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET toutes les annonces d'un jardinier (ses compétences/services)
router.get("/jardinier/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Pour les jardiniers (ami_du_vert), on récupère leurs informations et compétences
    const jardinier = await prisma.utilisateur.findUnique({
      where: {
        id_utilisateur: BigInt(userId),
        role: 'ami_du_vert'
      },
      include: {
        competences: {
          include: {
            competence: true
          }
        }
      }
    });

    if (jardinier) {
      const jardinierJSON = {
        id_utilisateur: jardinier.id_utilisateur.toString(),
        prenom: jardinier.prenom,
        nom: jardinier.nom,
        biographie: jardinier.biographie,
        telephone: jardinier.telephone,
        adresse: jardinier.adresse,
        competences: jardinier.competences.map(uc => uc.competence.nom)
      };
      res.json([jardinierJSON]);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("❌ Erreur récupération annonces jardinier :", err);
    res.status(500).json({ error: "Erreur serveur" });  
  }
});

// 🔹 GET toutes les annonces (jardins + jardiniers)
router.get("/", async (req, res) => {
  try {
    // Récupérer tous les jardins avec les informations du propriétaire
    const jardins = await prisma.jardin.findMany({
      include: {
        utilisateur: {
          select: {
            prenom: true,
            nom: true
          }
        }
      },
      orderBy: {
        date_publication: 'desc'
      }
    });

    // Convertir les jardins avec BigInt en format JSON et ajouter le type d'annonce
    const jardinsJSON = jardins.map(jardin => ({
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString(),
      prenom: jardin.utilisateur.prenom,
      nom: jardin.utilisateur.nom,
      type_annonce: 'jardin'
    }));

    // Pour l'instant, on ne récupère que les jardins
    // Plus tard, on pourra ajouter les annonces de services des jardiniers
    const toutes_annonces = jardinsJSON;
    
    res.json(toutes_annonces);
  } catch (err) {
    console.error("❌ Erreur récupération toutes annonces :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;