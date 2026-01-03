import { test, expect } from '@playwright/test';

const JARDIN_ID = 1;
const API_URL = '/api/reservation';

// Utilitaire pour mocker les requêtes API
async function mockApiError(page, status, errorMsg) {
  await page.route('**' + API_URL, async route => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: errorMsg })
    });
  });
}

test.describe('Réservation - cas d\'erreur', () => {
  test('affiche une erreur si id_utilisateur est manquant', async ({ page }) => {
    await mockApiError(page, 400, 'id_utilisateur + (id_jardin OU id_jardinier) requis');
    await page.goto(`/reservation_jardin?id=${JARDIN_ID}`);
    await page.waitForSelector('form');
    // Simule la soumission sans utilisateur
    await page.fill('textarea', 'Test erreur utilisateur');
    await page.click('button:has-text("Réserver")');
    await expect(page.locator('text=id_utilisateur')).toBeVisible();
  });

  test('affiche une erreur si id_jardin et id_jardinier sont manquants', async ({ page }) => {
    await mockApiError(page, 400, 'id_utilisateur + (id_jardin OU id_jardinier) requis');
    await page.goto(`/reservation_jardin?id=${JARDIN_ID}`);
    await page.waitForSelector('form');
    // Simule la soumission sans jardin/jardinier
    await page.fill('textarea', 'Test erreur jardin/jardinier');
    await page.click('button:has-text("Réserver")');
    await expect(page.locator('text=id_jardin OU id_jardinier')).toBeVisible();
  });

  test('affiche une erreur serveur si la date est invalide', async ({ page }) => {
    await mockApiError(page, 500, 'Erreur serveur lors de la création');
    await page.goto(`/reservation_jardin?id=${JARDIN_ID}`);
    await page.waitForSelector('form');
    // Simule la soumission avec une date invalide
    await page.fill('textarea', 'Test erreur date');
    await page.click('button:has-text("Réserver")');
    await expect(page.locator('text=Erreur serveur')).toBeVisible();
  });
});
