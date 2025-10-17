const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ✅ Créer une réservation
router.post('/', async (req, res) => {
  const { id_utilisateur, id_jardin, startDate, startTime, endDate, endTime, commentaires } = req.body;

  if (!id_utilisateur || !id_jardin || !startDate || !startTime) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        id_utilisateur: BigInt(id_utilisateur),
        id_jardin: BigInt(id_jardin),
        date_reservation: new Date(startDate + 'T' + startTime),
        statut: 'confirmee',
        commentaires: commentaires || ''
      }
    });

    // Convertir les BigInt en string pour JSON
    const reservationJSON = {
      ...reservation,
      id_reservation: reservation.id_reservation.toString(),
      id_utilisateur: reservation.id_utilisateur.toString(),
      id_jardin: reservation.id_jardin?.toString() || null,
      id_disponibilite: reservation.id_disponibilite?.toString() || null
    };

    res.status(201).json(reservationJSON);
  } catch (err) {
    console.error('❌ Erreur ajout réservation :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Lister les réservations d'un utilisateur
router.get('/utilisateur/:id', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { id_utilisateur: BigInt(req.params.id) },
      include: {
        jardin: {
          select: {
            titre: true,
            adresse: true
          }
        }
      }
    });

    // Convertir et aplatir les données
    const reservationsJSON = reservations.map(r => ({
      ...r,
      id_reservation: r.id_reservation.toString(),
      id_utilisateur: r.id_utilisateur.toString(),
      id_jardin: r.id_jardin?.toString() || null,
      id_disponibilite: r.id_disponibilite?.toString() || null,
      titre: r.jardin?.titre || null,
      adresse: r.jardin?.adresse || null
    }));

    res.json(reservationsJSON);
  } catch (err) {
    console.error('❌ Erreur récupération réservations :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Annuler une réservation
router.delete('/:id', async (req, res) => {
  try {
    await prisma.reservation.delete({
      where: { id_reservation: BigInt(req.params.id) }
    });
    res.json({ message: 'Réservation annulée' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    console.error('❌ Erreur suppression réservation :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
