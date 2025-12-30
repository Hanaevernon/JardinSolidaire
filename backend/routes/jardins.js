const multer = require('multer');
const path = require('path');
// Enregistrer les fichiers dans backend/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });
const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


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
      where: { id_jardin: BigInt(id) },
      include: {
        utilisateur: { select: { prenom: true, nom: true, email: true, telephone: true, id_utilisateur: true } }
      }
    });
    if (!jardin) {
      return res.status(404).json({ error: "Jardin non trouvé" });
    }
    // Convertir les BigInt en string pour JSON
    const jardinJSON = {
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString(),
      utilisateur: {
        ...jardin.utilisateur,
        id_utilisateur: jardin.utilisateur?.id_utilisateur?.toString?.() ?? undefined
      }
    };
    res.json(jardinJSON);
  } catch (err) {
    console.error("Erreur récupération jardin par ID :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", upload.array('photos'), async (req, res) => {
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
      region,
    } = req.body;

    // Les photos uploadées
    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map(f => '/uploads/' + f.filename);
    }

    const jardin = await prisma.jardin.create({
      data: {
        id_proprietaire: BigInt(id_proprietaire),
        titre,
        description,
        adresse,
        superficie: superficie ? parseFloat(superficie) : null,
        type,
        besoins,
        region,
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
router.put("/:id", upload.array('photos'), async (req, res) => {
  console.log('PUT /jardins/:id req.body:', req.body);
  console.log('PUT /jardins/:id req.file:', req.file);
  console.log('PUT /jardins/:id req.body:', req.body);
  console.log('PUT /jardins/:id req.file:', req.file);
  try {
    const { id } = req.params;
  const { titre, description, adresse, superficie, type, besoins, region, anciennesPhotos } = req.body;

  // Construction dynamique des champs à mettre à jour
  const dataToUpdate = {};
  if (titre !== undefined) dataToUpdate.titre = titre;
  if (description !== undefined) dataToUpdate.description = description;
  if (adresse !== undefined) dataToUpdate.adresse = adresse;
  if (superficie !== undefined && superficie !== "") dataToUpdate.superficie = parseFloat(superficie);
  if (type !== undefined && type !== "") dataToUpdate.type = type;
  if (besoins !== undefined && besoins !== "") dataToUpdate.besoins = besoins;
  if (region !== undefined && region !== "") dataToUpdate.region = region;


    // Fusionner anciennes photos et nouvelles uploadées
    let photosFinales = [];
    // Anciennes photos (venant du formulaire)
    if (anciennesPhotos) {
      if (Array.isArray(anciennesPhotos)) {
        photosFinales = photosFinales.concat(anciennesPhotos);
      } else {
        photosFinales.push(anciennesPhotos);
      }
    }
    // Nouvelles photos uploadées
    if (req.files && req.files.length > 0) {
      const newPhotoPaths = req.files.map(f => '/uploads/' + f.filename);
      photosFinales = photosFinales.concat(newPhotoPaths);
    }
    // Si on a des photos, on les met à jour
    if (photosFinales.length > 0) {
      dataToUpdate.photos = photosFinales;
    }

    dataToUpdate.date_publication = new Date();

    const jardin = await prisma.jardin.update({
      where: { id_jardin: BigInt(id) },
      data: dataToUpdate
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
