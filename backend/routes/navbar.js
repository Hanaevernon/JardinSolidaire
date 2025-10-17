const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Vérifie si l'utilisateur a déjà une annonce (jardin ou jardinier)
router.get("/:id_utilisateur/has-annonce", async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    // Vérifier si c'est un propriétaire (annonce de jardin)
    const jardin = await prisma.jardin.findFirst({
      where: { id_proprietaire: BigInt(id_utilisateur) }
    });

    // Note: Le fichier original utilise une table 'jardinier' qui n'existe pas dans le schéma Prisma
    // Pour l'instant, on vérifie seulement les jardins
    // TODO: Adapter selon votre logique métier pour les jardiniers

    // Si l'utilisateur a au moins une annonce
    const hasAnnonce = !!jardin;

    res.json({ hasAnnonce });
  } catch (err) {
    console.error("❌ Erreur récupération has-annonce :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
