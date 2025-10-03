const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/inscription
router.post("/", async (req, res) => {
  const { prenom, nom, email, password, role } = req.body;

  if (!prenom || !nom || !email || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    // Vérifie si l’email existe déjà
    const check = await pool.query(
      "SELECT id_utilisateur FROM utilisateur WHERE email = $1",
      [email]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
    }

    // Insertion
    const result = await pool.query(
      `INSERT INTO utilisateur (prenom, nom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [prenom, nom, email, password, role]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: "Inscription réussie",
      user: {
        id_utilisateur: newUser.id_utilisateur,
        prenom: newUser.prenom,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur lors de l’inscription." });
  }
});

// POST /api/inscription/register (si tu veux aussi cette route)
router.post("/register", async (req, res) => {
  const { prenom, nom, email, password, role } = req.body;

  if (!prenom || !nom || !email || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO utilisateur (prenom, nom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [prenom, nom, email, password, role]
    );

    const newUser = result.rows[0];
    res.status(201).json({
      message: "Inscription réussie !",
      user: {
        id_utilisateur: newUser.id_utilisateur,
        prenom: newUser.prenom,
        nom: newUser.nom,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erreur inscription :", error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
});

module.exports = router;
