const express = require("express");
const router = express.Router();
const pool = require("../db"); // ton fichier de connexion PostgreSQL

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

    // Insert dans réservation
    const result = await pool.query(
      `INSERT INTO reservation (id_utilisateur, id_jardin, date_reservation, statut, commentaires)
       VALUES ($1, $2, NOW(), $3, $4)
       RETURNING id_reservation`,
      [id_utilisateur, id_jardin, "en_attente", `Créneau ${debut} - ${fin}`]
    );

    res.status(201).json({
      message: "Réservation enregistrée",
      id_reservation: result.rows[0].id_reservation,
    });

  } catch (err) {
    console.error("Erreur création réservation jardiniers:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
