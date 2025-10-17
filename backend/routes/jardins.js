const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
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
    const jardins = await prisma.jardin.findMany();
    
    // Convertir les BigInt en string pour JSON
    const jardinsJSON = jardins.map(jardin => ({
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString()
    }));
    
    res.json(jardinsJSON);
  } catch (err) {
    console.error("Erreur récupération jardins :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET jardin par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const jardin = await prisma.jardin.findUnique({
      where: { id_jardin: BigInt(id) }
    });
    
    if (!jardin) {
      return res.status(404).json({ error: "Jardin non trouvé" });
    }

    // Convertir les BigInt en string pour JSON
    const jardinJSON = {
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString()
    };
    
    res.json(jardinJSON);
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

    const jardin = await prisma.jardin.create({
      data: {
        id_proprietaire: BigInt(id_proprietaire),
        titre,
        description,
        adresse,
        superficie: superficie ? parseFloat(superficie) : null,
        type,
        besoins,
        photos: photos,
        date_publication: new Date(),
        statut: 'disponible'
      }
    });

    // Convertir les BigInt en string pour JSON
    const jardinJSON = {
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString()
    };

    res.status(201).json(jardinJSON);
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

    const jardin = await prisma.jardin.update({
      where: { id_jardin: BigInt(id) },
      data: {
        titre,
        description,
        adresse,
        superficie: superficie ? parseFloat(superficie) : null,
        type: type || null,
        besoins: besoins || null,
        photos: photosFinales,
        date_publication: new Date()
      }
    });

    // Convertir les BigInt en string pour JSON
    const jardinJSON = {
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString()
    };

    res.json(jardinJSON);
  } catch (err) {
    console.error("❌ Erreur modification jardin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 DELETE supprimer un jardin
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const jardin = await prisma.jardin.delete({
      where: { id_jardin: BigInt(id) }
    });
    
    res.json({ message: "Jardin supprimé avec succès" });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Jardin introuvable" });
    }
    console.error("❌ Erreur suppression jardin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
