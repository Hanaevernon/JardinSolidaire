// backend/tests/reservation.test.js
// Test d'intégration pour la création d'une réservation
// Vérifie que la réservation est bien enregistrée en base et que la réponse est correcte

const request = require('supertest');
const app = require('../server'); // Fichier principal Express
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('POST /api/reservation', () => {
  // Nettoie la table reservation avant chaque test
  beforeEach(async () => {
    await prisma.reservation.deleteMany({});
  });

  it('crée une réservation et la retourne', async () => {
    // Données de test (les IDs doivent exister en base)
    const data = {
      id_utilisateur: 1,
      id_jardin: 2,
      date_reservation: '2025-11-25T10:00:00.000Z',
      statut: 'en_attente',
      commentaires: 'Test backend',
      creneaux: ['08h00 - 09h00']
    };

    // Envoie la requête POST
    const res = await request(app)
      .post('/api/reservation')
      .send(data)
      .expect(201);

    // Vérifie la réponse
    expect(res.body).toHaveProperty('id_reservation');
    expect(res.body).toHaveProperty('id_utilisateur', '1');
    expect(res.body).toHaveProperty('id_jardin', '2');
    expect(res.body).toHaveProperty('statut', 'en_attente');
    expect(res.body).toHaveProperty('commentaires', 'Test backend');
    expect(res.body).toHaveProperty('creneaux');
    expect(Array.isArray(res.body.creneaux)).toBe(true);

    // Vérifie que la réservation existe en base
    const dbResa = await prisma.reservation.findUnique({
      where: { id_reservation: BigInt(res.body.id_reservation) }
    });
    expect(dbResa).not.toBeNull();
    expect(dbResa.commentaires).toBe('Test backend');
  });
});
