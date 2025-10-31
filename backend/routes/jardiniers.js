const express = require("express");
const pool = require("../db"); // connexion PostgreSQL

const router = express.Router();

/**
 * 🔹 GET /api/jardiniers
 * Liste tous les amis_du_vert (utilisateurs avec role = 'ami_du_vert')
 * + possibilité de filtrer par note, type, mot-clé
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        j.id_jardinier,
        j.titre,
        j.description,
        j.localisation,
        j.disponibilites,
        j.competences,
        j.photos,
        u.id_utilisateur,
        u.prenom,
        u.nom,
        u.note_moyenne,
        u.photo_profil
      FROM jardiniers j
      JOIN utilisateur u ON j.id_utilisateur = u.id_utilisateur
      ORDER BY j.date_creation DESC
    `);

    // ✅ parse si c’est un tableau texte
    const jardiniers = result.rows.map(j => ({
      ...j,
      photos: Array.isArray(j.photos)
        ? j.photos
        : typeof j.photos === "string"
          ? JSON.parse(j.photos)
          : []
    }));

    res.json(jardiniers);
  } catch (error) {
    console.error("❌ Erreur chargement jardiniers :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 🔹 POST /api/jardiniers
 * Créer une annonce de jardinier (dans la table jardiniers)
 */
router.post("/", async (req, res) => {
  const {
    id_utilisateur,
    titre,
    description,
    localisation,
    disponibilites,
    competences,
    photos,
  } = req.body;

  if (!id_utilisateur || !titre || !description) {
    return res
      .status(400)
      .json({ error: "id_utilisateur, titre et description sont obligatoires" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO jardiniers 
        (id_utilisateur, titre, description, localisation, disponibilites, competences, photos) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id_utilisateur,
        titre,
        description,
        localisation || null,
        disponibilites || null,
        competences || null,
        photos || [],
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erreur création annonce jardinier :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 🔹 PUT /api/jardiniers/:id
 * Modifier une annonce de jardinier
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    titre,
    description,
    localisation,
    disponibilites,
    competences,
    photos,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE jardiniers
       SET titre = $1,
           description = $2,
           localisation = $3,
           disponibilites = $4,
           competences = $5,
           photos = $6,
           date_modification = NOW()
       WHERE id_jardinier = $7
       RETURNING *`,
      [
        titre,
        description,
        localisation,
        disponibilites,
        competences,
        photos || [],
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Annonce jardinier introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erreur modification annonce jardinier :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 🔹 DELETE /api/jardiniers/:id
 * Supprimer une annonce de jardinier
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM jardiniers WHERE id_jardinier = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Annonce jardinier introuvable" });
    }

    res.json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur suppression annonce jardinier :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 🔹 GET /api/jardiniers/:id
 * Récupérer un jardinier par son id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        j.id_jardinier,
        j.titre,
        j.description,
        j.localisation,
        j.disponibilites,
        j.competences,
        j.photos,
        u.id_utilisateur,
        u.prenom,
        u.nom,
        u.note_moyenne,
        u.photo_profil,
        u.biographie,
        u.email,
        u.telephone
      FROM jardiniers j
      JOIN utilisateur u ON j.id_utilisateur = u.id_utilisateur
      WHERE j.id_jardinier = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jardinier introuvable" });
    }

    // ✅ Nettoyage photos
    const jardinier = result.rows[0];
    jardinier.photos = Array.isArray(jardinier.photos)
      ? jardinier.photos
      : typeof jardinier.photos === "string"
      ? JSON.parse(jardinier.photos)
      : [];

    res.json(jardinier);
  } catch (error) {
    console.error("❌ Erreur récupération jardinier :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 🔹 GET /api/jardiniers/:id
 * Récupère un jardinier par son ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         j.id_jardinier,
         j.id_utilisateur,
         j.titre,
         j.description,
         j.localisation,
         j.disponibilites,
         j.competences,
         j.photos,
         u.prenom,
         u.nom,
         u.photo_profil,
         u.note_moyenne
       FROM jardiniers j
       JOIN utilisateur u ON j.id_utilisateur = u.id_utilisateur
       WHERE j.id_jardinier = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jardinier introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Erreur récupération jardinier :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});



module.exports = router;
