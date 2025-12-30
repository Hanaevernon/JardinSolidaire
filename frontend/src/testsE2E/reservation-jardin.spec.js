import { test, expect } from '@playwright/test';

// Remplacez cet ID par un ID de jardin valide pour vos tests
const JARDIN_ID = 1;

// Simule un utilisateur connecté
const mockUser = {
  id_utilisateur: 123,
  nom: 'Testeur',
};

test.describe('Réservation d\'un jardin', () => {
  test.beforeEach(async ({ page }) => {
    // Simule l'utilisateur connecté
    await page.addInitScript((user) => {
      localStorage.setItem('user', JSON.stringify(user));
    }, mockUser);
    // Mock API réservation si besoin
    await page.route('**/api/reservations', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    // Va sur la page de réservation et attend le formulaire
    await page.goto(`/reservation_jardin?id=${JARDIN_ID}`);
    await page.waitForSelector('form');
  });

  test('réserve un jardin avec date, créneaux et commentaire', async ({ page }) => {
    // Sélectionne une date (demain)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await page.click('button:has-text("Modifier la date")');
    await page.locator('.react-datepicker__day--' + tomorrow.getDate()).first().click();
    await page.click('button:has-text("Confirmer la nouvelle date")');

    // Sélectionne deux créneaux horaires
    await page.check('input[type="checkbox"]:nth-of-type(2)');
    await page.check('input[type="checkbox"]:nth-of-type(3)');

    // Ajoute un commentaire
    await page.fill('textarea', 'Je souhaite arroser le jardin.');

    // Clique sur le bouton Réserver
    await page.click('button:has-text("Réserver")');

    // Vérifie le message de confirmation
    await expect(page.locator('text=Réservation enregistrée avec succès !')).toBeVisible();
  });

  test('affiche une erreur si aucune date sélectionnée', async ({ page }) => {
    // Désactive la date
    await page.click('button:has-text("Modifier la date")');
    await page.click('button:has-text("Confirmer la nouvelle date")');
    // Désélectionne tous les créneaux
    await page.uncheck('input[type="checkbox"]:nth-of-type(1)');
    await page.uncheck('input[type="checkbox"]:nth-of-type(2)');
    await page.uncheck('input[type="checkbox"]:nth-of-type(3)');
    await page.uncheck('input[type="checkbox"]:nth-of-type(4)');
    await page.uncheck('input[type="checkbox"]:nth-of-type(5)');
    await page.uncheck('input[type="checkbox"]:nth-of-type(6)');
    await page.uncheck('input[type="checkbox"]:nth-of-type(7)');
    // Clique sur Réserver
    await page.click('button:has-text("Réserver")');
    // Vérifie le message d'erreur
    await expect(page.locator('text=Veuillez sélectionner une date.')).toBeVisible();
  });
});
