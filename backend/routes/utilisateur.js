// backend/routes/utilisateur.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET un utilisateur par son id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE id_utilisateur = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur récupération utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
