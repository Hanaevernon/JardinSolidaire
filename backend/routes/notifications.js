const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/messages/non-lus/:userId
router.get('/messages/non-lus/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const count = await prisma.messagerie.count({
      where: {
        id_destinataire: userId,
        lu: false
      }
    });
    res.json({ count });
  } catch (err) {
    console.error('Erreur récupération messages non lus :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/reservations/non-traitees/:userId
router.get('/reservations/non-traitees/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const count = await prisma.reservation.count({
      where: {
        id_utilisateur: userId,
        statut: 'en_attente'
      }
    });
    res.json({ count });
  } catch (err) {
    console.error('Erreur récupération réservations non traitées :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/demandes/non-traitees/:userId
router.get('/demandes/non-traitees/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    if (!prisma.demande) {
      console.error('prisma.demande is undefined! Vérifiez le modèle et la génération du client Prisma.');
      return res.status(500).json({ error: 'prisma.demande is undefined!' });
    }
    const count = await prisma.demande.count({
      where: {
        id_destinataire: userId,
        statut: 'en_attente'
      }
    });
    res.json({ count });
  } catch (err) {
    console.error('Erreur récupération demandes non traitées :', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
