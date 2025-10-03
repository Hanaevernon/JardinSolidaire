// routes/confirmation_reservation_jardins.js
const express = require("express");
const router = express.Router();
const pool = require("../db"); // ton db.js avec pg.Pool

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

    const result = await pool.query(
      `INSERT INTO reservation (id_utilisateur, id_jardin, date_reservation, statut, commentaires)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_utilisateur, id_jardin, startDateTime, "en_attente", "Réservé via confirmation_reservation_jardins"]
    );

    res.status(201).json({
      message: "✅ Réservation confirmée",
      reservation: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Erreur confirmation réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de la confirmation de réservation." });
  }
});

module.exports = router;
