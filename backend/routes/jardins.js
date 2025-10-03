const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");

// 📂 config stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // dossier "uploads" dans backend/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* -------------------- ROUTES -------------------- */

// 🔹 GET tous les jardins
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jardin");
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur récupération jardins :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET jardin par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM jardin WHERE id_jardin = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jardin non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur récupération jardin par ID :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", upload.array("photos", 5), async (req, res) => {
  try {
    console.log("📩 Body :", req.body);
    console.log("📸 Files :", req.files);
    const {
      id_proprietaire,
      titre,
      description,
      adresse,
      superficie,
      type,
      besoins,
    } = req.body;

    const photos = req.files.map((file) => `/uploads/${file.filename}`);

    const result = await pool.query(
      `INSERT INTO jardin 
       (id_proprietaire, titre, description, adresse, superficie, type, besoins, photos, date_publication, statut) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),'disponible')
       RETURNING *`,
      [
        id_proprietaire,
        titre,
        description,
        adresse,
        superficie,
        type,
        besoins,
        JSON.stringify(photos),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur ajout jardin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// 🔹 PUT modifier un jardin
router.put("/:id", upload.array("photos", 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, adresse, superficie, type, besoins, anciennesPhotos } = req.body;

    // anciennes photos si présentes
    let photosFinales = [];
    if (anciennesPhotos) {
      photosFinales = Array.isArray(anciennesPhotos)
        ? anciennesPhotos
        : [anciennesPhotos];
    }

    // nouvelles photos uploadées
    if (req.files && req.files.length > 0) {
      const nouvellesPhotos = req.files.map((file) => `/uploads/${file.filename}`);
      photosFinales = [...photosFinales, ...nouvellesPhotos];
    }

    const result = await pool.query(
      `UPDATE jardin
       SET titre = $1,
           description = $2,
           adresse = $3,
           superficie = $4,
           type = $5,
           besoins = $6,
           photos = $7,
           date_publication = NOW()
       WHERE id_jardin = $8
       RETURNING *`,
      [
        titre,
        description,
        adresse,
        superficie || null,
        type || null,
        besoins || null,
        JSON.stringify(photosFinales),
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jardin introuvable" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erreur modification jardin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 DELETE supprimer un jardin
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM jardin WHERE id_jardin = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jardin introuvable" });
    }
    res.json({ message: "Jardin supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur suppression jardin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
