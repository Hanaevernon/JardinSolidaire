const express = require("express");
const router = express.Router();
const pool = require("../db");

// Vérifie si l'utilisateur a déjà une annonce (jardin ou jardinier)
router.get("/:id_utilisateur/has-annonce", async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    // Vérifier si c’est un propriétaire (annonce de jardin)
    const jardin = await pool.query(
      "SELECT 1 FROM jardin WHERE id_proprietaire = $1 LIMIT 1",
      [id_utilisateur]
    );

    // Vérifier si c’est un ami_du_vert (annonce de jardinier)
    const jardinier = await pool.query(
      "SELECT 1 FROM jardinier WHERE id_utilisateur = $1 LIMIT 1",
      [id_utilisateur]
    );

    // Si l’utilisateur a au moins une annonce
    const hasAnnonce = jardin.rows.length > 0 || jardinier.rows.length > 0;

    res.json({ hasAnnonce });
  } catch (err) {
    console.error("❌ Erreur récupération has-annonce :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
