const express = require("express");
const router = express.Router();
const pool = require("../db");

// 🔹 GET toutes les annonces d'un propriétaire (ses jardins)
router.get("/proprietaire/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT j.*, u.prenom, u.nom 
       FROM jardin j 
       JOIN utilisateur u ON j.id_proprietaire = u.id_utilisateur 
       WHERE j.id_proprietaire = $1 
       ORDER BY j.date_publication DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erreur récupération jardins propriétaire :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET toutes les annonces d'un jardinier (ses compétences/services)
router.get("/jardinier/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Pour les jardiniers (ami_du_vert), on pourrait récupérer leurs compétences
    // ou créer une table spécifique pour leurs annonces de service
    // Pour l'instant, retournons un tableau vide
    const result = await pool.query(
      `SELECT u.id_utilisateur, u.prenom, u.nom, u.biographie, u.telephone, u.adresse
       FROM utilisateur u 
       WHERE u.id_utilisateur = $1 AND u.role = 'ami_du_vert'`,
      [userId]
    );
    res.json([]); // Tableau vide pour l'instant
  } catch (err) {
    console.error("❌ Erreur récupération annonces jardinier :", err);
    res.status(500).json({ error: "Erreur serveur" });  
  }
});

// 🔹 GET toutes les annonces (jardins + jardiniers)
router.get("/", async (req, res) => {
  try {
    // Récupérer tous les jardins
    const jardins = await pool.query(
      `SELECT j.*, u.prenom, u.nom, 'jardin' as type_annonce
       FROM jardin j 
       JOIN utilisateur u ON j.id_proprietaire = u.id_utilisateur 
       ORDER BY j.date_publication DESC`
    );

    // Pour l'instant, on ne récupère que les jardins
    // Plus tard, on pourra ajouter une table pour les annonces de services des jardiniers
    const toutes_annonces = jardins.rows;
    
    // Trier par date de publication
    toutes_annonces.sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication));

    res.json(toutes_annonces);
  } catch (err) {
    console.error("❌ Erreur récupération toutes annonces :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;