const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    const result = await pool.query("SELECT * FROM utilisateur WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || user.mot_de_passe !== password) {
      return res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
    }

    res.status(200).json({
      message: "Connexion réussie !",
      user: {
        id_utilisateur: user.id_utilisateur,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        role: user.role,
        photo: user.photo_profil,
      },
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
