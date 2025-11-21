const express = require("express");
const pool = require("../db");
const router = express.Router();

// POST /api/disponibilites - Ajoute une ou plusieurs dates de disponibilité pour un jardinier
router.post("/", async (req, res) => {
  const { id_jardinier, disponibilites } = req.body; // disponibilites = [{date, plages: [{heureDebut, heureFin}]}]
  if (!id_jardinier || !Array.isArray(disponibilites) || disponibilites.length === 0) {
    return res.status(400).json({ error: "id_jardinier et disponibilites[] requis" });
  }
  try {
    let allRows = [];
    for (const dispo of disponibilites) {
      const { date, plages } = dispo;
      if (!date || !Array.isArray(plages) || plages.length === 0) continue;
      for (const plage of plages) {
        const { heureDebut, heureFin } = plage;
        if (!heureDebut || !heureFin || heureDebut >= heureFin) continue;
        const result = await pool.query(
          `INSERT INTO disponibilites (id_jardin, date_dispo, heure_debut, heure_fin) VALUES ($1, $2, $3, $4) RETURNING *`,
          [id_jardinier, date, heureDebut, heureFin]
        );
        allRows.push(result.rows[0]);
      }
    }
    res.status(201).json(allRows);
  } catch (err) {
    console.error("❌ Erreur ajout disponibilites :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/disponibilites/:id_jardinier - Récupère toutes les dates de disponibilité d'un jardinier
router.get("/:id_jardinier", async (req, res) => {
  const { id_jardinier } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM disponibilites WHERE id_jardin = $1 ORDER BY date_dispo ASC",
      [id_jardinier]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur récupération disponibilites :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
