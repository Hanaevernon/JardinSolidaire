const express = require('express');
const router = express.Router();
const pool = require('../db'); // ta connexion PostgreSQL (db.js)

// ✅ Créer une réservation
router.post('/', async (req, res) => {
  const { id_utilisateur, id_jardin, startDate, startTime, endDate, endTime, commentaires } = req.body;

  if (!id_utilisateur || !id_jardin || !startDate || !startTime) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reservation (id_utilisateur, id_jardin, date_reservation, statut, commentaires)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        id_utilisateur,
        id_jardin,
        new Date(startDate + 'T' + startTime),
        'confirmee',
        commentaires || ''
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Erreur ajout réservation :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Lister les réservations d’un utilisateur
router.get('/utilisateur/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, j.titre, j.adresse 
       FROM reservation r
       JOIN jardin j ON r.id_jardin = j.id_jardin
       WHERE r.id_utilisateur = $1`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Erreur récupération réservations :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Annuler une réservation
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM reservation WHERE id_reservation = $1', [req.params.id]);
    res.json({ message: 'Réservation annulée' });
  } catch (err) {
    console.error('❌ Erreur suppression réservation :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
