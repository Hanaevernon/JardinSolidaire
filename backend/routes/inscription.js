const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/inscription
router.post("/", async (req, res) => {
  const { prenom, nom, email, password, role } = req.body;

  if (!prenom || !nom || !email || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    // Vérifie si l'email existe déjà
    const existingUser = await prisma.utilisateur.findUnique({
      where: { email: email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "Cet e-mail est déjà utilisé." });
    }

    // Insertion
    const newUser = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email,
        mot_de_passe: password,
        role
      }
    });

    res.status(201).json({
      message: "Inscription réussie",
      user: {
        id_utilisateur: newUser.id_utilisateur.toString(),
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
    const newUser = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email,
        mot_de_passe: password,
        role
      }
    });

    res.status(201).json({
      message: "Inscription réussie !",
      user: {
        id_utilisateur: newUser.id_utilisateur.toString(),
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
