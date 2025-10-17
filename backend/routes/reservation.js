const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔹 GET /api/reservation - liste toutes les réservations
router.get("/", async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        utilisateur: {
          select: {
            prenom: true,
            nom: true
          }
        },
        jardin: {
          select: {
            titre: true,
            adresse: true
          }
        }
      },
      orderBy: {
        date_reservation: 'desc'
      }
    });

    // Convertir les BigInt en string et aplatir les données
    const reservationsJSON = reservations.map(r => ({
      id_reservation: r.id_reservation.toString(),
      id_utilisateur: r.id_utilisateur.toString(),
      id_jardin: r.id_jardin?.toString() || null,
      id_disponibilite: r.id_disponibilite?.toString() || null,
      statut: r.statut,
      date_reservation: r.date_reservation,
      commentaires: r.commentaires,
      utilisateur_prenom: r.utilisateur?.prenom || null,
      utilisateur_nom: r.utilisateur?.nom || null,
      jardin_titre: r.jardin?.titre || null,
      jardin_adresse: r.jardin?.adresse || null
    }));

    res.json(reservationsJSON);
  } catch (err) {
    console.error("❌ Erreur récupération réservations :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Créer une réservation (jardin OU jardinier)
router.post("/", async (req, res) => {
  const { id_utilisateur, id_jardin, id_jardinier, date_reservation, statut, commentaires } = req.body;

  if (!id_utilisateur || (!id_jardin && !id_jardinier)) {
    return res.status(400).json({ error: "id_utilisateur + (id_jardin OU id_jardinier) requis" });
  }

  try {
    // Note: Le schéma Prisma ne contient pas de champ 'id_jardinier' dans la table reservation
    // Adaptation nécessaire selon votre logique métier
    const reservation = await prisma.reservation.create({
      data: {
        id_utilisateur: BigInt(id_utilisateur),
        id_jardin: id_jardin ? BigInt(id_jardin) : null,
        date_reservation: new Date(date_reservation),
        statut: statut || "en_attente",
        commentaires: commentaires || null
      }
    });

    // Convertir les BigInt en string pour JSON
    const reservationJSON = {
      ...reservation,
      id_reservation: reservation.id_reservation.toString(),
      id_utilisateur: reservation.id_utilisateur.toString(),
      id_jardin: reservation.id_jardin?.toString() || null,
      id_disponibilite: reservation.id_disponibilite?.toString() || null
    };

    res.status(201).json(reservationJSON);
  } catch (err) {
    console.error("❌ Erreur création réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de la création" });
  }
});

// 🔹 GET réservations d'un utilisateur spécifique
router.get("/utilisateur/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        id_utilisateur: BigInt(userId)
      },
      include: {
        jardin: {
          include: {
            utilisateur: {
              select: {
                prenom: true,
                nom: true
              }
            }
          }
        }
      },
      orderBy: {
        date_reservation: 'desc'
      }
    });

    // Convertir et aplatir les données
    const reservationsJSON = reservations.map(r => ({
      id_reservation: r.id_reservation.toString(),
      id_utilisateur: r.id_utilisateur.toString(),
      id_jardin: r.id_jardin?.toString() || null,
      statut: r.statut,
      date_reservation: r.date_reservation,
      commentaires: r.commentaires,
      titre_annonce: r.jardin?.titre || null,
      adresse: r.jardin?.adresse || null,
      type: r.jardin?.type || null,
      proprietaire_prenom: r.jardin?.utilisateur?.prenom || null,
      proprietaire_nom: r.jardin?.utilisateur?.nom || null
    }));

    res.json(reservationsJSON);
  } catch (err) {
    console.error("❌ Erreur récupération réservations utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET une réservation spécifique par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id_reservation: BigInt(id)
      },
      include: {
        jardin: {
          include: {
            utilisateur: {
              select: {
                prenom: true,
                nom: true,
                email: true,
                telephone: true
              }
            }
          }
        }
      }
    });

    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Convertir et aplatir les données
    const reservationJSON = {
      id_reservation: reservation.id_reservation.toString(),
      id_utilisateur: reservation.id_utilisateur.toString(),
      id_jardin: reservation.id_jardin?.toString() || null,
      statut: reservation.statut,
      date_reservation: reservation.date_reservation,
      commentaires: reservation.commentaires,
      titre_annonce: reservation.jardin?.titre || null,
      adresse: reservation.jardin?.adresse || null,
      type: reservation.jardin?.type || null,
      description: reservation.jardin?.description || null,
      proprietaire_prenom: reservation.jardin?.utilisateur?.prenom || null,
      proprietaire_nom: reservation.jardin?.utilisateur?.nom || null,
      proprietaire_email: reservation.jardin?.utilisateur?.email || null,
      proprietaire_telephone: reservation.jardin?.utilisateur?.telephone || null
    };

    res.json(reservationJSON);
  } catch (err) {
    console.error("❌ Erreur récupération réservation :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 PUT mettre à jour le statut d'une réservation
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;
  
  try {
    const reservation = await prisma.reservation.update({
      where: {
        id_reservation: BigInt(id)
      },
      data: {
        statut: statut
      }
    });

    // Convertir les BigInt en string pour JSON
    const reservationJSON = {
      ...reservation,
      id_reservation: reservation.id_reservation.toString(),
      id_utilisateur: reservation.id_utilisateur.toString(),
      id_jardin: reservation.id_jardin?.toString() || null,
      id_disponibilite: reservation.id_disponibilite?.toString() || null
    };

    res.json(reservationJSON);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }
    console.error("❌ Erreur mise à jour réservation :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET réservations reçues par un propriétaire pour ses jardins
router.get("/proprietaire/:proprietaireId", async (req, res) => {
  const { proprietaireId } = req.params;
  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        jardin: {
          id_proprietaire: BigInt(proprietaireId)
        }
      },
      include: {
        utilisateur: {
          select: {
            prenom: true,
            nom: true,
            email: true,
            telephone: true
          }
        },
        jardin: {
          select: {
            titre: true,
            adresse: true,
            type: true
          }
        }
      },
      orderBy: {
        date_reservation: 'desc'
      }
    });

    // Convertir et aplatir les données
    const reservationsJSON = reservations.map(r => ({
      id_reservation: r.id_reservation.toString(),
      id_utilisateur: r.id_utilisateur.toString(),
      id_jardin: r.id_jardin?.toString() || null,
      statut: r.statut,
      date_reservation: r.date_reservation,
      commentaires: r.commentaires,
      titre_annonce: r.jardin?.titre || null,
      adresse: r.jardin?.adresse || null,
      type: r.jardin?.type || null,
      client_prenom: r.utilisateur?.prenom || null,
      client_nom: r.utilisateur?.nom || null,
      client_email: r.utilisateur?.email || null,
      client_telephone: r.utilisateur?.telephone || null
    }));

    res.json(reservationsJSON);
  } catch (err) {
    console.error("❌ Erreur récupération réservations propriétaire :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
