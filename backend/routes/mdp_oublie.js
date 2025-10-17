const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { email, nouveau_mdp } = req.body;

  try {
    const user = await prisma.utilisateur.update({
      where: { email: email },
      data: { mot_de_passe: nouveau_mdp }
    });

    res.json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
