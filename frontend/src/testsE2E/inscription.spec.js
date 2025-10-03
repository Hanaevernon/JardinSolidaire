import { test, expect } from '@playwright/test';

const url = 'http://localhost:3000/inscription';

test('Inscription avec données valides', async ({ page }) => {
  await page.goto('http://localhost:3000/inscription');

  await page.fill('input[name="prenom"]', 'Test');
  await page.fill('input[name="nom"]', 'Utilisateur');
  await page.fill('input[name="email"]', 'test@exemple.com');
  await page.fill('input[name="password"]', 'Test123!');
  await page.fill('input[name="confirmPassword"]', 'Test123!');
  await page.selectOption('select[name="role"]', 'ami_du_vert');

  await page.click('button[type="submit"]');

  // Attendre le message de bienvenue ou un message d'erreur
  await expect(page.locator('text=Bienvenue')).toBeVisible();
});

test.describe('Formulaire d’inscription', () => {
  test('✅ Inscription avec données valides', async ({ page }) => {
    await page.goto(url);
    await page.fill('input[name="prenom"]', 'Test');
    await page.fill('input[name="nom"]', 'User');
    await page.fill('input[name="email"]', 'test@exemple.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    await page.selectOption('select[name="role"]', 'ami_du_vert');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Bienvenue')).toBeVisible();
  });

  test('❌ Mots de passe différents', async ({ page }) => {
    await page.goto(url);
    await page.fill('input[name="prenom"]', 'Test');
    await page.fill('input[name="nom"]', 'User');
    await page.fill('input[name="email"]', 'test3@exemple.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test1234!');
    await page.selectOption('select[name="role"]', 'ami_du_vert');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Les mots de passe ne correspondent pas')).toBeVisible();
  });
});