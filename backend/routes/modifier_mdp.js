const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { email, ancien_mdp, nouveau_mdp } = req.body;

  try {
    const user = await prisma.utilisateur.findUnique({
      where: { email: email }
    });

    if (!user || user.mot_de_passe !== ancien_mdp) {
      return res.status(401).json({ error: "Ancien mot de passe incorrect." });
    }

    await prisma.utilisateur.update({
      where: { email: email },
      data: { mot_de_passe: nouveau_mdp }
    });

    res.json({ message: "Mot de passe modifié avec succès." });
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
