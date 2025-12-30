const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fonction utilitaire pour convertir BigInt en string dans un objet ou tableau
function toSerializable(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toSerializable);
  } else if (obj && typeof obj === 'object') {
    const res = {};
    for (const k in obj) {
      if (typeof obj[k] === 'bigint') {
        res[k] = obj[k].toString();
      } else if (typeof obj[k] === 'object') {
        res[k] = toSerializable(obj[k]);
      } else {
        res[k] = obj[k];
      }
    }
    return res;
  }
  return obj;
}

// Ajouter un favori (jardin ou jardinier)
router.post('/', async (req, res) => {
  const { id_utilisateur, id_jardin, id_jardinier } = req.body;
  if (!id_utilisateur || (!id_jardin && !id_jardinier)) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }
  try {
    const favori = await prisma.favoris.create({
      data: {
        id_utilisateur,
        id_jardin: id_jardin || null,
        id_jardinier: id_jardinier || null,
      },
    });
    res.status(201).json(toSerializable(favori));
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ce favori existe déjà.' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un favori (jardin ou jardinier)
router.delete('/', async (req, res) => {
  const { id_utilisateur, id_jardin, id_jardinier } = req.body;
  if (!id_utilisateur || (!id_jardin && !id_jardinier)) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }
  try {
    let where = { id_utilisateur };
    if (id_jardin) where.id_jardin = id_jardin;
    if (id_jardinier) where.id_jardinier = id_jardinier;
    await prisma.favoris.deleteMany({ where });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Récupérer les favoris d'un utilisateur
router.get('/:id_utilisateur', async (req, res) => {
  const { id_utilisateur } = req.params;
  try {
    const favoris = await prisma.favoris.findMany({
      where: { id_utilisateur: BigInt(id_utilisateur) },
      include: { jardin: true, jardinier: true },
    });
  res.json(toSerializable(favoris));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
