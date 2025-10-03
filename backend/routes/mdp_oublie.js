const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email, nouveau_mdp } = req.body;

  try {
    const result = await pool.query(
      `UPDATE utilisateur SET mot_de_passe = $1 WHERE email = $2 RETURNING *`,
      [nouveau_mdp, email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
