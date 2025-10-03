const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ Créer une réservation
router.post("/", async (req, res) => {
  const { id_utilisateur, id_jardin, date_reservation, statut, commentaires } = req.body;

  if (!id_utilisateur || !id_jardin || !date_reservation) {
    return res.status(400).json({ error: "id_utilisateur, id_jardin et date_reservation sont obligatoires" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reservation (id_utilisateur, id_jardin, date_reservation, statut, commentaires)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id_utilisateur, id_jardin, date_reservation, statut || "en_attente", commentaires || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur création réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de la réservation" });
  }
});

// ✅ Annuler une réservation
router.delete("/:id_reservation", async (req, res) => {
  const { id_reservation } = req.params;

  try {
    await pool.query(`DELETE FROM reservation WHERE id_reservation = $1`, [id_reservation]);
    res.json({ success: true, message: "Réservation annulée avec succès" });
  } catch (err) {
    console.error("Erreur annulation réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de l’annulation" });
  }
});

// ✅ Lister les réservations d’un utilisateur
router.get("/utilisateur/:id_utilisateur", async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.*, j.titre, j.adresse
       FROM reservation r
       JOIN jardin j ON r.id_jardin = j.id_jardin
       WHERE r.id_utilisateur = $1
       ORDER BY r.date_reservation DESC`,
      [id_utilisateur]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur récupération réservations :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
