// Cette fonction gère l'envoi d'une réservation à l'API et retourne un message selon le résultat
import { submitReservation } from '../utils/reservationUtils';

// On mock la fonction fetch pour simuler les réponses de l'API
beforeEach(() => {
  global.fetch = jest.fn();
});

// On réinitialise les mocks après chaque test
afterEach(() => {
  jest.resetAllMocks();
});

describe('submitReservation', () => {
  // Cas 1 : la réservation est acceptée par l'API
  it('retourne succès si la réservation est enregistrée', async () => {
    // On simule une réponse API OK
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });
    // On appelle la fonction avec des paramètres factices
    const result = await submitReservation({
      apiUrl: 'http://fake-api',
      id_utilisateur: 1,
      id_jardin: 2,
      date_reservation: '2025-11-25',
      creneaux: ['08h00 - 09h00']
    });
    // On vérifie que le message de succès est retourné
    expect(result).toEqual({ success: true, message: "Réservation enregistrée avec succès !" });
  });

  // Cas 2 : l'API retourne une erreur (ex : créneau indisponible)
  it('retourne erreur API si la réservation échoue', async () => {
    // On simule une réponse API en erreur
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Créneau indisponible" })
    });
    const result = await submitReservation({
      apiUrl: 'http://fake-api',
      id_utilisateur: 1,
      id_jardin: 2,
      date_reservation: '2025-11-25',
      creneaux: ['08h00 - 09h00']
    });
    // On vérifie que le message d'erreur API est retourné
    expect(result).toEqual({ success: false, message: "Créneau indisponible" });
  });

  // Cas 3 : erreur réseau (fetch plante)
  it('retourne erreur réseau si fetch plante', async () => {
    // On simule une erreur réseau
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const result = await submitReservation({
      apiUrl: 'http://fake-api',
      id_utilisateur: 1,
      id_jardin: 2,
      date_reservation: '2025-11-25',
      creneaux: ['08h00 - 09h00']
    });
    // On vérifie que le message d'erreur réseau est retourné
    expect(result).toEqual({ success: false, message: "Erreur réseau. Réessayez plus tard." });
  });
});
