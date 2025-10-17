const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const jardin = await prisma.jardin.findUnique({
      where: { id_jardin: BigInt(id) }
    });
    
    if (!jardin) {
      return res.status(404).json({ error: "Jardin introuvable" });
    }

    // Convertir les BigInt en string pour JSON
    const jardinJSON = {
      ...jardin,
      id_jardin: jardin.id_jardin.toString(),
      id_proprietaire: jardin.id_proprietaire.toString()
    };
    
    res.json(jardinJSON);
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
