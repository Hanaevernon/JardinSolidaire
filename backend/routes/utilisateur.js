// backend/routes/utilisateur.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET un utilisateur par son id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: BigInt(id) }
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Convertir les BigInt en string pour JSON
    const userJSON = {
      ...user,
      id_utilisateur: user.id_utilisateur.toString()
    };

    res.json(userJSON);
  } catch (err) {
    console.error("❌ Erreur récupération utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT mettre à jour un utilisateur
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { prenom, nom, email, telephone, adresse, biographie } = req.body;
  
  try {
    const user = await prisma.utilisateur.update({
      where: { id_utilisateur: BigInt(id) },
      data: {
        prenom,
        nom,
        email,
        telephone,
        adresse,
        biographie
      }
    });

    // Convertir les BigInt en string pour JSON
    const userJSON = {
      ...user,
      id_utilisateur: user.id_utilisateur.toString()
    };

    res.json(userJSON);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    console.error("❌ Erreur mise à jour utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET les compétences d'un utilisateur
router.get("/:id/competences", async (req, res) => {
  const { id } = req.params;
  try {
    const competences = await prisma.utilisateurCompetence.findMany({
      where: { id_utilisateur: BigInt(id) },
      include: {
        competence: true
      }
    });

    // Formatage pour correspondre à l'ancien format
    const competencesJSON = competences.map(uc => ({
      nom: uc.competence.nom,
      id_competence: uc.competence.id_competence
    }));

    res.json(competencesJSON);
  } catch (err) {
    console.error("❌ Erreur récupération compétences utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST ajouter une compétence à un utilisateur
router.post("/:id/competences", async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: "Nom de compétence requis" });
  try {
    // Vérifier si la compétence existe
    let competence = await prisma.competence.findUnique({ where: { nom } });
    if (!competence) {
      competence = await prisma.competence.create({ data: { nom } });
    }
    // Ajouter la compétence à l'utilisateur
    await prisma.utilisateurCompetence.create({
      data: {
        id_utilisateur: BigInt(id),
        id_competence: competence.id_competence
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur ajout compétence utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE supprimer une compétence d'un utilisateur
router.delete("/:id/competences/:id_competence", async (req, res) => {
  const { id, id_competence } = req.params;
  try {
    await prisma.utilisateurCompetence.deleteMany({
      where: {
        id_utilisateur: BigInt(id),
        id_competence: Number(id_competence)
      }
    });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur suppression compétence utilisateur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
