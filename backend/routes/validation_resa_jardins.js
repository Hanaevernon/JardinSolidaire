const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Créer une réservation
router.post("/", async (req, res) => {
  const { id_utilisateur, id_jardin, date_reservation, statut, commentaires } = req.body;

  if (!id_utilisateur || !id_jardin || !date_reservation) {
    return res.status(400).json({ error: "id_utilisateur, id_jardin et date_reservation sont obligatoires" });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        id_utilisateur: BigInt(id_utilisateur),
        id_jardin: BigInt(id_jardin),
        date_reservation: new Date(date_reservation),
        statut: statut || "en_attente",
        commentaires: commentaires || ""
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
    console.error("Erreur création réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de la réservation" });
  }
});

// ✅ Annuler une réservation
router.delete("/:id_reservation", async (req, res) => {
  const { id_reservation } = req.params;

  try {
    await prisma.reservation.delete({
      where: { id_reservation: BigInt(id_reservation) }
    });
    res.json({ success: true, message: "Réservation annulée avec succès" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }
    console.error("Erreur annulation réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de l'annulation" });
  }
});

// ✅ Lister les réservations d'un utilisateur
router.get("/utilisateur/:id_utilisateur", async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    const reservations = await prisma.reservation.findMany({
      where: { id_utilisateur: BigInt(id_utilisateur) },
      include: {
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

    // Convertir et aplatir les données
    const reservationsJSON = reservations.map(r => ({
      ...r,
      id_reservation: r.id_reservation.toString(),
      id_utilisateur: r.id_utilisateur.toString(),
      id_jardin: r.id_jardin?.toString() || null,
      id_disponibilite: r.id_disponibilite?.toString() || null,
      titre: r.jardin?.titre || null,
      adresse: r.jardin?.adresse || null
    }));

    res.json(reservationsJSON);
  } catch (err) {
    console.error("Erreur récupération réservations :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
