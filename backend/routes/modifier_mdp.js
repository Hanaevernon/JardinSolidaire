const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email, ancien_mdp, nouveau_mdp } = req.body;

  try {
    const result = await pool.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || user.mot_de_passe !== ancien_mdp) {
      return res.status(401).json({ error: "Ancien mot de passe incorrect." });
    }

    await pool.query(`UPDATE utilisateur SET mot_de_passe = $1 WHERE email = $2`, [nouveau_mdp, email]);

    res.json({ message: "Mot de passe modifié avec succès." });
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
