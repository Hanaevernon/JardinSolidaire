const express = require("express");
const router = express.Router();
const pool = require("../db"); // ton fichier db.js avec Pool

// 🔹 GET /api/reservation - liste toutes les réservations
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id_reservation,
        r.id_utilisateur,
        r.id_jardin,
        r.id_disponibilite,
        r.statut,
        r.date_reservation,
        r.commentaires,
        u.prenom AS utilisateur_prenom,
        u.nom AS utilisateur_nom,
        j.titre AS jardin_titre,
        j.adresse AS jardin_adresse
      FROM reservation r
      LEFT JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
      LEFT JOIN jardin j ON r.id_jardin = j.id_jardin
      ORDER BY r.date_reservation DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur récupération réservations :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Créer une réservation (jardin OU jardinier)
router.post("/", async (req, res) => {
  const { id_utilisateur, id_jardin, id_jardinier, date_reservation, statut, commentaires } = req.body;

  if (!id_utilisateur || (!id_jardin && !id_jardinier)) {
    return res.status(400).json({ error: "id_utilisateur + (id_jardin OU id_jardinier) requis" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reservation 
        (id_utilisateur, id_jardin, id_jardinier, date_reservation, statut, commentaires)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        id_utilisateur,
        id_jardin || null,
        id_jardinier || null,
        new Date(date_reservation),
        statut || "en_attente",
        commentaires || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur création réservation :", err);
    res.status(500).json({ error: "Erreur serveur lors de la création" });
  }
});

// 🔹 GET réservations d'un utilisateur spécifique
router.get("/utilisateur/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        r.id_reservation,
        r.id_utilisateur,
        r.id_jardin,
        r.statut,
        r.date_reservation,
        r.commentaires,
        j.titre AS titre_annonce,
        j.adresse,
        j.type,
        u_proprietaire.prenom AS proprietaire_prenom,
        u_proprietaire.nom AS proprietaire_nom
      FROM reservation r
      LEFT JOIN jardin j ON r.id_jardin = j.id_jardin
      LEFT JOIN utilisateur u_proprietaire ON j.id_proprietaire = u_proprietaire.id_utilisateur
      WHERE r.id_utilisateur = $1
      ORDER BY r.date_reservation DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur récupération réservations utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
