const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/reservation_jardiniers
router.post("/", async (req, res) => {
  try {
    const { id_utilisateur, id_jardin, startDate, startTime, endDate, endTime } = req.body;

    // Vérification basique
    if (!id_utilisateur || !id_jardin || !startDate || !startTime || !endDate || !endTime) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    // On fusionne date + heure
    const debut = `${startDate} ${startTime}`;
    const fin   = `${endDate} ${endTime}`;

    // Insert dans réservation avec Prisma
    const reservation = await prisma.reservation.create({
      data: {
        id_utilisateur: BigInt(id_utilisateur),
        id_jardin: BigInt(id_jardin),
        date_reservation: new Date(),
        statut: "en_attente",
        commentaires: `Créneau ${debut} - ${fin}`
      }
    });

    res.status(201).json({
      message: "Réservation enregistrée",
      id_reservation: reservation.id_reservation.toString(),
    });

  } catch (err) {
    console.error("Erreur création réservation jardiniers:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
