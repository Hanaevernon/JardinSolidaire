const express = require("express");
const pool = require("../db");
const router = express.Router();

// POST /api/disponibilites - Ajoute une ou plusieurs dates de disponibilité pour un jardinier
router.post("/", async (req, res) => {
  const { id_jardinier, dates } = req.body; // dates = tableau de string (YYYY-MM-DD)
  if (!id_jardinier || !Array.isArray(dates) || dates.length === 0) {
    return res.status(400).json({ error: "id_jardinier et dates[] requis" });
  }
  try {
    const values = dates.map(date => `(${id_jardinier}, '${date}')`).join(",");
    const query = `INSERT INTO disponibilites (id_jardin, date_dispo) VALUES ${values} RETURNING *`;
    const result = await pool.query(query);
    res.status(201).json(result.rows);
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
