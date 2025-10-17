// routes/confirmation_reservation_jardins.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/confirmation_reservation_jardins
router.post("/", async (req, res) => {
  const { id_utilisateur, id_jardin, startDate, startTime, endDate, endTime } = req.body;

  if (!id_utilisateur || !id_jardin || !startDate || !startTime || !endDate || !endTime) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  try {
    // On combine date + heure en timestamp PostgreSQL
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

    const reservation = await prisma.reservation.create({
      data: {
        id_utilisateur: BigInt(id_utilisateur),
        id_jardin: BigInt(id_jardin),
        date_reservation: startDateTime,
        statut: "en_attente",
        commentaires: "Réservé via confirmation_reservation_jardins"
      }
    });

    res.status(201).json({
      message: "✅ Réservation confirmée",
      reservation: {
        ...reservation,
        id_reservation: reservation.id_reservation.toString(),
        id_utilisateur: reservation.id_utilisateur.toString(),
        id_jardin: reservation.id_jardin.toString(),
        id_disponibilite: reservation.id_disponibilite?.toString() || null
      },
    });
  } catch (err) {
    console.error("❌ Erreur confirmation réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de la confirmation de réservation." });
  }
});

module.exports = router;
